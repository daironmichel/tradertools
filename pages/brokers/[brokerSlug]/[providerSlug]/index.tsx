import * as React from "react";
import Head from "next/head";
import Router from "next/router";
import { graphql } from "react-relay";
import { ButtonGroup, Button, NonIdealState, Intent } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../../../../components/Layout";
import { ProviderSlugQueryResponse } from "./__generated__/ProviderSlugQuery.graphql";
import { IconNames } from "@blueprintjs/icons";
import ConnectProviderMutation from "../../../../mutations/Provider/ConnectProviderMutation";
import { ConnectProviderMutationResponse } from "../../../../mutations/Provider/__generated__/ConnectProviderMutation.graphql";
import { PayloadError } from "relay-runtime";
import Error from "../../../_error";

interface Props extends ProviderSlugQueryResponse {}
interface State {
  loading: boolean;
}

class Index extends React.Component<Props, State> {
  state = {
    loading: false
  };

  static query = graphql`
    query ProviderSlugQuery($brokerSlug: String!, $providerSlug: String!) {
      viewer {
        broker(slug: $brokerSlug) {
          id
          databaseId
          name
          serviceProvider(slug: $providerSlug) {
            id
            databaseId
            name
            slug
            session {
              id
              databaseId
              status
            }
          }
        }
      }
    }
  `;

  onAuthorize = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ loading: true });
    ConnectProviderMutation.commit({ providerId: e.currentTarget.value }, this.connectCompleted, this.connectError);
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

  render() {
    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProvider } = broker || {};
    const { session } = serviceProvider || {};
    const connectionStatus = session ? session.status : "CLOSED";

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

        <Flex justifyContent="center" alignItems="center" flexDirection="column">
          <h4>Status: {session ? session.status : "CLOSED"}</h4>
          {connectionStatus !== "CONNECTED" && (
            <NonIdealState
              icon={IconNames.OFFLINE}
              title="Authorize Application"
              description={`${broker.name} requires that you authorize this application to access data and place orders on your behalf.`}
              action={
                <Button
                  large
                  text="Authorize"
                  intent={Intent.PRIMARY}
                  value={serviceProvider.databaseId}
                  loading={this.state.loading}
                  onClick={this.onAuthorize}
                />
              }
            />
          )}
          {connectionStatus === "CONNECTED" && (
            <Flex justifyContent="center" alignItems="center" flexDirection="column">
              <Button large intent={Intent.SUCCESS} text="Buy" css={{ width: 80, marginBottom: 10 }} />
              <Button large intent={Intent.DANGER} text="Sell" css={{ width: 80 }} />
            </Flex>
          )}
        </Flex>
      </Layout>
    );
  }
}

export default Index;
