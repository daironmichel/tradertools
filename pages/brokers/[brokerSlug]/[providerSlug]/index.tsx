import * as React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { graphql } from 'react-relay';
import {
  Button,
  NonIdealState,
  Intent,
  InputGroup,
  ControlGroup,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { Flex } from 'rebass';
import Layout from '../../../../components/Layout';
import { ProviderSlugQueryResponse } from '../../../../__generated__/ProviderSlugQuery.graphql';
import { IconNames } from '@blueprintjs/icons';
import ConnectProviderMutation from '../../../../mutations/Provider/ConnectProviderMutation';
import { ConnectProviderMutationResponse } from '../../../../__generated__/ConnectProviderMutation.graphql';
import { PayloadError } from 'relay-runtime';
import Error from '../../../_error';
import { withRelay } from '../../../../components/RelayComponent';
import SyncAccountsMutation from '../../../../mutations/Account/SyncAccountsMutation';
import SellStockMutation from '../../../../mutations/Order/SellStockMutation';
import BuyStockMutation from '../../../../mutations/Order/BuyStockMutation';
import ErrorState from '../../../../components/generic/ErrorState';
import PositionAndOrderListRenderer from '../../../../components/Account/PositionAndOrderListRenderer';

type TradingStrategy = ProviderSlugQueryResponse['viewer']['tradingStrategies'][0];

type Props = ProviderSlugQueryResponse;
interface State {
  loading: boolean;
  strategies: ReadonlyArray<TradingStrategy>;
  selectedStrategy: TradingStrategy | null;
  symbol: string;
  connectError: PayloadError | Error | null;
}

class Index extends React.Component<Props, State> {
  static query = graphql`
    query ProviderSlugQuery($brokerSlug: String!, $providerSlug: String!) {
      viewer {
        settings {
          refreshRate
        }
        tradingStrategies {
          id
          databaseId
          name
          exposurePercent
          profitPercent
          lossPercent
        }
        broker(slug: $brokerSlug) {
          id
          databaseId
          name
          serviceProvider(slug: $providerSlug) {
            id
            databaseId
            name
            sessionStatus
          }
        }
      }
    }
  `;

  constructor(props: Props) {
    super(props);

    const { viewer } = this.props;
    const { tradingStrategies } = viewer;

    this.state = {
      loading: false,
      strategies: tradingStrategies,
      selectedStrategy: tradingStrategies.length > 0 ? tradingStrategies[0] : null,
      symbol: '',
      connectError: null,
    };
  }

  onAuthorize = (): void => {
    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.error({ message: 'Service provider missing.', viewer });
      return;
    }

    this.setState({ loading: true });
    const connect = new ConnectProviderMutation();
    connect.commit({ providerId: serviceProvider.databaseId.toString() }, this.connectCompleted, this.connectError);
  };

  connectCompleted = (response: ConnectProviderMutationResponse, errors?: ReadonlyArray<PayloadError> | null): void => {
    this.setState({ loading: false });
    if (errors) {
      console.error(errors);
      this.setState({ connectError: errors[0] });
      return;
    }

    const { serviceProvider, authorizeUrl, callbackEnabled, error, errorMessage } = response.connectProvider;
    if (error) {
      console.error(`${error}: ${errorMessage}`);
      return;
    }

    if (!serviceProvider) {
      console.error('service provider not recieved');
      return;
    }

    if (!authorizeUrl) {
      console.error('authorization url not received');
      return;
    }

    // save provider id in local storage
    window.localStorage.setItem('providerId', serviceProvider.databaseId.toString());
    // if callback is configured redirect to authorizeUrl
    // else open authorizeUrl in new window and redirect to verification page
    if (callbackEnabled) {
      Router.push(authorizeUrl);
    } else {
      window.open(authorizeUrl);
      Router.push('/verify');
    }
  };

  connectError = (error: Error): void => {
    this.setState({ loading: false, connectError: error });
    console.error(error);
  };

  handleStrategyChange = (newStrategy: TradingStrategy): void => {
    this.setState({ selectedStrategy: newStrategy });
  };

  handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ symbol: event.currentTarget.value.toUpperCase() });
  };

  handleSyncOnClick = (): void => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.warn('No service provider supplied');
      return;
    }

    this.setState({ loading: true });
    const sync = new SyncAccountsMutation();
    sync.commit(
      { providerId: serviceProvider.databaseId.toString() },
      this.syncAccountsCompleted,
      this.syncAccountsError,
    );
  };

  syncAccountsCompleted = (): void => {
    this.setState({ loading: false });
  };

  syncAccountsError = (): void => {
    this.setState({ loading: false });
  };

  handleSellOnClick = (): void => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.warn('No service provider supplied');
      return;
    }

    this.setState({ loading: true });
    const sell = new SellStockMutation();
    sell.commit(
      {
        providerId: serviceProvider.databaseId.toString(),
        symbol: this.state.symbol,
      },
      this.sellCompleted,
      this.sellError,
    );
  };

  sellCompleted = (): void => {
    this.setState({ loading: false });
  };

  sellError = (): void => {
    this.setState({ loading: false });
  };

  handleBuyOnClick = (): void => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};
    const { selectedStrategy } = this.state;

    if (!serviceProvider) {
      console.warn('No service provider supplied');
      return;
    }

    if (!selectedStrategy) {
      console.warn('No strategy selected');
      return;
    }

    this.setState({ loading: true });
    const buy = new BuyStockMutation();
    buy.commit(
      {
        providerId: serviceProvider.databaseId.toString(),
        strategyId: selectedStrategy.databaseId.toString(),
        symbol: this.state.symbol,
      },
      this.buyCompleted,
      this.buyError,
    );
  };

  buyCompleted = (): void => {
    this.setState({ loading: false });
  };

  buyError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { viewer } = this.props;
    const { broker, tradingStrategies, settings } = viewer;
    const { serviceProvider } = broker || {};
    const { sessionStatus = 'CLOSED' } = serviceProvider || {};

    const { selectedStrategy, symbol, loading, connectError } = this.state;

    if (!broker || !serviceProvider) {
      return <Error title="Not Found" description="There's nothing to see here." />;
    }

    return (
      <Layout>
        <Head>
          <title>
            {broker.name} - {serviceProvider.name}
          </title>
        </Head>

        <Flex justifyContent="center" alignItems="center" flexDirection="column" flex="1">
          <h4>Status: {sessionStatus}</h4>
          {sessionStatus !== 'CONNECTED' && connectError && (
            <ErrorState
              title="Error Connecting"
              description={connectError.message}
              action={
                <Button large text="Try Again" intent={Intent.PRIMARY} loading={loading} onClick={this.onAuthorize} />
              }
            />
          )}
          {sessionStatus !== 'CONNECTED' && !connectError && (
            <NonIdealState
              icon={IconNames.OFFLINE}
              title="Authorize Application"
              description={`${broker.name} requires that you authorize this application to access data and place orders on your behalf.`}
              action={
                <Button large text="Authorize" intent={Intent.PRIMARY} loading={loading} onClick={this.onAuthorize} />
              }
            />
          )}
          {sessionStatus === 'CONNECTED' && (
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              width={[1, 1 / 2, 1 / 3]}
              p={3}
              css={{ '> *': { marginBottom: 15 } }}
            >
              <Button large fill text="Sync Accounts" onClick={this.handleSyncOnClick} disabled={loading} />
              <ControlGroup css={{ width: '100%' }}>
                <InputGroup
                  placeholder="SYMBOL"
                  fill
                  large
                  css={{ input: { textTransform: 'uppercase' } }}
                  disabled={loading}
                  value={symbol}
                  onChange={this.handleSymbolChange}
                  rightElement={
                    <Popover
                      content={
                        <Menu>
                          {tradingStrategies.map(strat => (
                            <MenuItem
                              key={strat.id}
                              text={`${strat.name} (${strat.exposurePercent}%, ${strat.profitPercent}%, ${strat.lossPercent})`}
                              onClick={this.handleStrategyChange.bind(this, strat)}
                            />
                          ))}
                        </Menu>
                      }
                      disabled={loading}
                      position={Position.BOTTOM_RIGHT}
                    >
                      <Button
                        disabled={loading}
                        minimal={true}
                        rightIcon="caret-down"
                        intent={selectedStrategy ? Intent.NONE : Intent.DANGER}
                      >
                        {selectedStrategy ? selectedStrategy.name : 'Strategy?'}
                      </Button>
                    </Popover>
                  }
                />
                <Button
                  large
                  intent={Intent.SUCCESS}
                  text="Buy"
                  disabled={loading || !symbol}
                  onClick={this.handleBuyOnClick}
                />
              </ControlGroup>
              <PositionAndOrderListRenderer
                autoRefetch={settings?.refreshRate || 0}
                variables={{
                  providerId: serviceProvider.databaseId.toString(),
                }}
              />
            </Flex>
          )}
        </Flex>
      </Layout>
    );
  }
}

export default withRelay<Props>(Index, true);
