import { css } from "@emotion/core";
import React from "react";
import Head from "next/head";
import Router from "next/router";
import { Flex, Box } from "rebass";
import { Button, Card, InputGroup, Icon, Classes, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import Layout from "../components/Layout";
import AuthorizeConnectionMutation from "../mutations/Provider/AuthorizeConnectionMutation";
import { AuthorizeConnectionMutationResponse } from "../mutations/Provider/__generated__/AuthorizeConnectionMutation.graphql";
import { PayloadError } from "relay-runtime";

interface State {
  code: string;
  providerId: string | null;
  loading: boolean;
}

class Verify extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      code: "",
      providerId: window.localStorage.getItem("providerId"),
      loading: false
    };
  }

  _handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { providerId, code } = this.state;
    if (!providerId || !code) {
      console.error({ message: "Required fields missing.", providerId, code });
      return;
    }

    this.setState({ loading: true });
    AuthorizeConnectionMutation.commit(
      { providerId: providerId, oauthVerifier: this.state.code },
      this.onAuthorizeCompleted,
      this.onAuthorizeError
    );
  };

  onAuthorizeCompleted = (
    response: AuthorizeConnectionMutationResponse,
    errors?: ReadonlyArray<PayloadError> | null
  ) => {
    this.setState({ loading: false });
    if (errors) {
      console.error(errors);
      return;
    }

    const { error, errorMessage, serviceProvider } = response.authorizeConnection;
    if (error) {
      console.error(`${error}: ${errorMessage}`);
      return;
    }

    if (!serviceProvider) {
      console.error({ message: "No service provider recieved.", response });
      return;
    }

    const { broker } = serviceProvider;
    window.localStorage.removeItem("providerId");
    Router.push(`/brokers/${broker.slug}/${serviceProvider.slug}/`);
  };

  onAuthorizeError = (error: Error) => {
    this.setState({ loading: false });
    console.error(error);
  };

  _handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ code: e.currentTarget.value });
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>Etrade Verify</title>
        </Head>
        <Flex justifyContent="center" alignItems="center" flex="1">
          <Box width="100%" px={2} maxWidth={400}>
            <Card
              css={css`
                box-shadow: none;
                background-color: transparent;
              `}
            >
              <Flex justifyContent="center" alignItems="center" mb={40} mt={-160}>
                <Icon icon={IconNames.SHIELD} iconSize={164} className={Classes.TEXT_DISABLED} />
              </Flex>
              <form method="POST" onSubmit={this._handleSubmit}>
                <InputGroup
                  id="code"
                  name="code"
                  placeholder="code"
                  autoComplete="code"
                  large
                  value={this.state.code}
                  onChange={this._handleCodeChange}
                  css={css`
                    margin-bottom: 10px;
                  `}
                />
                <Flex
                  justifyContent="center"
                  sx={{
                    marginTop: 20,
                    marginLeft: "auto"
                  }}
                >
                  <Button type="submit" intent={Intent.PRIMARY} large fill text="Verify" loading={this.state.loading} />
                </Flex>
              </form>
            </Card>
          </Box>
        </Flex>
      </Layout>
    );
  }
}

export default Verify;
