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
  Callout,
  Colors,
  NumericInput,
} from '@blueprintjs/core';
import { Flex, Box } from 'rebass';
import Layout from '../../../../components/Layout';
import { ProviderSlugQueryResponse } from '../../../../__generated__/ProviderSlugQuery.graphql';
import { IconNames } from '@blueprintjs/icons';
import ConnectProviderMutation from '../../../../mutations/Provider/ConnectProviderMutation';
import { ConnectProviderMutationResponse } from '../../../../__generated__/ConnectProviderMutation.graphql';
import { PayloadError } from 'relay-runtime';
import Error from '../../../_error';
import { withRelay } from '../../../../components/RelayComponent';
import SyncAccountsMutation from '../../../../mutations/Account/SyncAccountsMutation';
import BuyStockMutation from '../../../../mutations/Order/BuyStockMutation';
import ErrorState from '../../../../components/generic/ErrorState';
import PositionAndOrderListRenderer from '../../../../components/Account/PositionAndOrderListRenderer';
import toaster from '../../../../components/toaster';
import numeral from 'numeral';
import { privateEncrypt } from 'crypto';

type TradingStrategy = ProviderSlugQueryResponse['viewer']['tradingStrategies'][0];

type Props = ProviderSlugQueryResponse;
interface State {
  loading: boolean;
  strategies: ReadonlyArray<TradingStrategy>;
  selectedStrategy: TradingStrategy | null;
  symbol: string;
  price: number;
  connectError: PayloadError | Error | null;
  syncAccountsNeeded: boolean;
}

class Index extends React.Component<Props, State> {
  static query = graphql`
    query ProviderSlugQuery($brokerSlug: String!, $providerSlug: String!) {
      viewer {
        settings {
          refreshRate
          defaultStrategy {
            id
            databaseId
            name
            exposurePercent
            profitPercent
            lossPercent
          }
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
            accountKey
          }
          accounts {
            edges {
              node {
                id
                accountKey
                name
                totalAccountValue
                cashAvailableForInvestment
              }
            }
          }
        }
      }
    }
  `;

  constructor(props: Props) {
    super(props);

    const { viewer } = this.props;
    const { tradingStrategies, settings } = viewer;
    const { defaultStrategy } = settings || {};

    this.state = {
      loading: false,
      strategies: tradingStrategies,
      selectedStrategy: defaultStrategy || null,
      symbol: '',
      price: 0,
      connectError: null,
      syncAccountsNeeded: true,
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
    // window.localStorage.setItem('providerId', serviceProvider.databaseId.toString());
    // if callback is configured redirect to authorizeUrl
    // else open authorizeUrl in new window and redirect to verification page
    if (callbackEnabled) {
      // window.location.assign(authorizeUrl);
      Router.push({ pathname: '/oauth/redirect', query: { to: authorizeUrl } });
    } else {
      window.open(authorizeUrl);
      Router.push('/oauth/verify');
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

  handlePriceChange = (valueAsNumber: number): void => {
    this.setState({ price: valueAsNumber });
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
    this.setState({ loading: false, syncAccountsNeeded: false });
    toaster.showSuccess('Accounts synched.');
  };

  syncAccountsError = (): void => {
    this.setState({ loading: false });
  };

  handleBuyOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.handleBuyOnClick();
  };

  handleBuyOnClick = (): void => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};
    const { selectedStrategy, symbol, price } = this.state;

    if (!serviceProvider) {
      console.warn('No service provider supplied');
      return;
    }

    if (!selectedStrategy) {
      console.warn('No strategy selected');
      return;
    }

    this.buy(serviceProvider.databaseId, selectedStrategy.databaseId, symbol, price);
  };

  buy = (providerId: number, strategyId: number, symbol: string, price = 0): void => {
    this.setState({ loading: true });
    const buy = new BuyStockMutation();
    buy.commit(
      {
        providerId: providerId.toString(),
        strategyId: strategyId.toString(),
        symbol: symbol,
        price: price,
      },
      this.buyCompleted,
      this.buyError,
    );
  };

  buyCompleted = (): void => {
    this.setState({ loading: false, syncAccountsNeeded: true });
    toaster.showSuccess('Buy order placed.');
  };

  buyError = (): void => {
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    const { viewer } = this.props;
    const { broker, tradingStrategies, settings } = viewer;
    const { serviceProvider, accounts } = broker || {};
    const { sessionStatus = 'CLOSED' } = serviceProvider || {};
    const accountEdges = accounts?.edges || [];

    const { selectedStrategy, symbol, price, loading, connectError, syncAccountsNeeded } = this.state;

    if (!broker || !serviceProvider) {
      return <Error title="Not Found" description="There's nothing to see here." />;
    }

    const defaultAccount = accountEdges.find(a => a.node.accountKey === serviceProvider.accountKey);

    if (!defaultAccount) {
      return <Error title="Not Found" description="Default account not configured." />;
    }

    const { totalAccountValue, cashAvailableForInvestment } = defaultAccount.node;
    const exposurePercent = selectedStrategy?.exposurePercent || 0;
    const exposureAmount = totalAccountValue * (exposurePercent / 100);
    const funded = exposureAmount < cashAvailableForInvestment;

    return (
      <Layout>
        <Head>
          <title>
            {broker.name} - {serviceProvider.name}
          </title>
        </Head>

        <Layout.Main>
          <h4 css={{ padding: '0 20px', textAlign: 'center' }}>
            {broker.name} - {serviceProvider.name}: {sessionStatus}
          </h4>
          <Flex justifyContent="center" alignItems="center" flexDirection="column" flex="1">
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
                <Callout intent={syncAccountsNeeded ? Intent.WARNING : Intent.NONE} css={{ marginTop: 0 }}>
                  <Flex justifyContent="space-between">
                    <Box>
                      <Box>
                        Accont Value: <span>{numeral(totalAccountValue).format('0,0.00')}</span>
                      </Box>
                      <Box>
                        Buying Power: <span>{numeral(cashAvailableForInvestment).format('0,0.00')}</span>
                      </Box>
                      <Box>
                        Exposure:{' '}
                        <span css={{ color: funded ? Colors.GREEN3 : Colors.RED3 }}>
                          {numeral(exposureAmount).format('0,0.00')}
                        </span>
                      </Box>
                    </Box>
                    {syncAccountsNeeded && (
                      <Button
                        large
                        minimal
                        intent={Intent.WARNING}
                        icon={IconNames.REFRESH}
                        onClick={this.handleSyncOnClick}
                        disabled={loading}
                      />
                    )}
                  </Flex>
                </Callout>
                <form onSubmit={this.handleBuyOnSubmit} css={{ width: '100%' }}>
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
                    <NumericInput placeholder="Price" value={price} fill large onValueChange={this.handlePriceChange} />
                    <Button
                      type="submit"
                      large
                      intent={Intent.SUCCESS}
                      text="Buy"
                      disabled={loading || !symbol}
                      onClick={this.handleBuyOnClick}
                    />
                  </ControlGroup>
                </form>
                <PositionAndOrderListRenderer
                  autoRefetch={settings?.refreshRate || 0}
                  selectedStrategyId={selectedStrategy?.databaseId}
                  variables={{
                    providerId: serviceProvider.databaseId.toString(),
                  }}
                />
              </Flex>
            )}
          </Flex>
        </Layout.Main>
      </Layout>
    );
  }
}

export default withRelay<Props>(Index, true);
