import * as React from "react";
import Head from "next/head";
import Router from "next/router";
import { graphql } from "react-relay";
import {
  Button,
  NonIdealState,
  Intent,
  InputGroup,
  ButtonGroup,
  ControlGroup,
  HTMLSelect,
  IOptionProps,
  Classes
} from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../../../../components/Layout";
import { ProviderSlugQueryResponse } from "./__generated__/ProviderSlugQuery.graphql";
import { IconNames } from "@blueprintjs/icons";
import ConnectProviderMutation from "../../../../mutations/Provider/ConnectProviderMutation";
import { ConnectProviderMutationResponse } from "../../../../mutations/Provider/__generated__/ConnectProviderMutation.graphql";
import { PayloadError } from "relay-runtime";
import Error from "../../../_error";
import { withRelay } from "../../../../components/RelayComponent";
import SyncAccountsMutation from "../../../../mutations/Account/SyncAccountsMutation";
import { SyncAccountsMutationResponse } from "../../../../mutations/Account/__generated__/SyncAccountsMutation.graphql";
import SellStockMutation from "../../../../mutations/Order/SellStockMutation";
import { SellStockMutationResponse } from "../../../../mutations/Order/__generated__/SellStockMutation.graphql";
import BuyStockMutation from "../../../../mutations/Order/BuyStockMutation";
import { BuyStockMutationResponse } from "../../../../mutations/Order/__generated__/BuyStockMutation.graphql";
import OrderListRenderer from "../../../../components/Order/OrderListRenderer";

interface Props extends ProviderSlugQueryResponse {}
interface State {
  loading: boolean;
  stratOptions: IOptionProps[];
  accountOptions: IOptionProps[];
  selectedStrategy: string | number;
  selectedAccount: string | number;
  symbol: string;
}

class Index extends React.Component<Props, State> {
  static query = graphql`
    query ProviderSlugQuery($brokerSlug: String!, $providerSlug: String!) {
      viewer {
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
          accounts {
            edges {
              node {
                id
                databaseId
                name
                accountId
                accountKey
              }
            }
          }
          serviceProvider(slug: $providerSlug) {
            id
            databaseId
            name
            slug
            sessionStatus
          }
        }
      }
    }
  `;

  constructor(props: Props) {
    super(props);

    const { viewer } = this.props;
    const { broker, tradingStrategies } = viewer;
    const { accounts } = broker || {};
    const stratOptions = tradingStrategies.map(s => ({ label: s.name, value: s.databaseId }));
    const accountOptions = accounts
      ? accounts.edges.map(a => ({ label: a.node.name || a.node.accountId, value: a.node.databaseId }))
      : [];

    this.state = {
      loading: false,
      stratOptions: stratOptions,
      accountOptions: accountOptions,
      selectedStrategy: stratOptions.length > 0 ? stratOptions[0].value : "",
      selectedAccount: accountOptions.length > 0 ? accountOptions[0].value : "",
      symbol: ""
    };
  }

  onAuthorize = (event: React.MouseEvent<HTMLElement>) => {
    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.error({ message: "Service provider missing.", viewer });
      return;
    }

    this.setState({ loading: true });
    ConnectProviderMutation.commit(
      { providerId: serviceProvider.databaseId.toString() },
      this.connectCompleted,
      this.connectError
    );
  };

  connectCompleted = (response: ConnectProviderMutationResponse, errors?: ReadonlyArray<PayloadError> | null) => {
    this.setState({ loading: false });
    if (errors) {
      console.error(errors);
      return;
    }

    const { serviceProvider, authorizeUrl, callbackEnabled, error, errorMessage } = response.connectProvider;
    if (error) {
      console.error(`${error}: ${errorMessage}`);
      return;
    }

    if (!serviceProvider) {
      console.error("service provider not recieved");
      return;
    }

    if (!authorizeUrl) {
      console.error("authorization url not received");
      return;
    }

    // save provider id in local storage
    window.localStorage.setItem("providerId", serviceProvider.databaseId.toString());
    // if callback is configured redirect to authorizeUrl
    // else open authorizeUrl in new window and redirect to verification page
    if (callbackEnabled) {
      Router.push(authorizeUrl);
    } else {
      window.open(authorizeUrl);
      Router.push("/verify");
    }
  };

  connectError = (error: Error) => {
    this.setState({ loading: false });
    console.error(error);
  };

  handleStrategyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedStrategy: event.currentTarget.value });
  };

  handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedAccount: event.currentTarget.value });
  };

  handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ symbol: event.currentTarget.value.toUpperCase() });
  };

  handleSyncOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.warn("No service provider supplied");
      return;
    }

    this.setState({ loading: true });
    const sync = new SyncAccountsMutation();
    sync.commit(
      { providerId: serviceProvider.databaseId.toString() },
      this.syncAccountsCompleted,
      this.syncAccountsError
    );
  };

  syncAccountsCompleted = (response: SyncAccountsMutationResponse, errors?: ReadonlyArray<PayloadError> | null) => {
    this.setState({ loading: false });
  };

  syncAccountsError = (error: Error) => {
    this.setState({ loading: false });
  };

  handleSellOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.warn("No service provider supplied");
      return;
    }

    this.setState({ loading: true });
    const sell = new SellStockMutation();
    sell.commit(
      {
        providerId: serviceProvider.databaseId.toString(),
        accountId: this.state.selectedAccount.toString(),
        symbol: this.state.symbol
      },
      this.sellCompleted,
      this.sellError
    );
  };

  sellCompleted = (response: SellStockMutationResponse, errors?: ReadonlyArray<PayloadError> | null) => {
    this.setState({ loading: false });
  };

  sellError = (error: Error) => {
    this.setState({ loading: false });
  };

  handleBuyOnClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.state.loading) return;

    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};

    if (!serviceProvider) {
      console.warn("No service provider supplied");
      return;
    }

    this.setState({ loading: true });
    const buy = new BuyStockMutation();
    buy.commit(
      {
        providerId: serviceProvider.databaseId.toString(),
        strategyId: this.state.selectedStrategy.toString(),
        accountId: this.state.selectedAccount.toString(),
        symbol: this.state.symbol
      },
      this.buyCompleted,
      this.buyError
    );
  };

  buyCompleted = (response: BuyStockMutationResponse, errors?: ReadonlyArray<PayloadError> | null) => {
    this.setState({ loading: false });
  };

  buyError = (error: Error) => {
    this.setState({ loading: false });
  };

  render() {
    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};
    const { sessionStatus = "CLOSED" } = serviceProvider || {};

    const { stratOptions, accountOptions, selectedStrategy, selectedAccount, symbol, loading } = this.state;

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
          {sessionStatus !== "CONNECTED" && (
            <NonIdealState
              icon={IconNames.OFFLINE}
              title="Authorize Application"
              description={`${broker.name} requires that you authorize this application to access data and place orders on your behalf.`}
              action={
                <Button large text="Authorize" intent={Intent.PRIMARY} loading={loading} onClick={this.onAuthorize} />
              }
            />
          )}
          {sessionStatus === "CONNECTED" && (
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              width={[1, 1 / 2, 1 / 3]}
              p={3}
              css={{ "> *": { marginBottom: 15 } }}
            >
              <Button large fill text="Sync Accounts" onClick={this.handleSyncOnClick} disabled={loading} />
              <InputGroup
                placeholder="SYMBOL"
                fill
                large
                css={{ input: { textTransform: "uppercase" } }}
                disabled={loading}
                value={symbol}
                onChange={this.handleSymbolChange}
              />
              <ControlGroup css={{ width: "100%" }}>
                <HTMLSelect
                  large
                  fill
                  disabled={loading}
                  options={accountOptions}
                  value={selectedAccount}
                  onChange={this.handleAccountChange}
                />
                <HTMLSelect
                  large
                  fill
                  disabled={loading}
                  options={stratOptions}
                  value={selectedStrategy}
                  onChange={this.handleStrategyChange}
                />
              </ControlGroup>
              <ButtonGroup large fill>
                <Button
                  large
                  intent={Intent.SUCCESS}
                  text="Buy"
                  disabled={loading || !symbol}
                  onClick={this.handleBuyOnClick}
                />
                <Button
                  large
                  intent={Intent.DANGER}
                  text="Sell"
                  disabled={loading || !symbol}
                  onClick={this.handleSellOnClick}
                />
              </ButtonGroup>
              {selectedAccount && (
                <OrderListRenderer
                  variables={{
                    accountId: selectedAccount.toString(),
                    providerId: serviceProvider.databaseId.toString()
                  }}
                />
              )}
            </Flex>
          )}
        </Flex>
      </Layout>
    );
  }
}

export default withRelay(Index, true);
