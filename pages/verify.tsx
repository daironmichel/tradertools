import { css } from "@emotion/core";
import React from "react";
import Head from "next/head";
import { withRouter } from "next/router";
import { Flex, Box } from "rebass";
import { Button, Card, InputGroup, Icon, Classes, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import Layout from "../components/Layout";
import AuthorizeConnectionMutation from "../mutations/Provider/AuthorizeConnectionMutation";
import { AuthorizeConnectionMutationResponse } from "../mutations/Provider/__generated__/AuthorizeConnectionMutation.graphql";
import { PayloadError } from "relay-runtime";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextPageContext } from "next";
import { ParsedUrlQuery, parse } from "querystring";

interface State {
  code: string;
  loading: boolean;
}

type Props = {
  query: ParsedUrlQuery;
} & WithRouterProps;

class Verify extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      code: "",
      loading: false
    };
  }

  componentDidMount() {
    const { router } = this.props;
    const search = router.asPath.substring(router.asPath.indexOf("?") + 1);
    const query = parse(search);
    const { oauth_verifier } = query;
    const providerId = window.localStorage.getItem("providerId");
    if (providerId && oauth_verifier) {
      this.verify(providerId, oauth_verifier.toString());
    }
  }

  _handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { code } = this.state;
    const providerId = window.localStorage.getItem("providerId");
    if (!providerId || !code) {
      console.error({ message: "Required data missing.", providerId, code });
      return;
    }

    this.verify(providerId, code);
  };

  verify = (providerId: string, oauthVerifier: string) => {
    this.setState({ loading: true });
    AuthorizeConnectionMutation.commit({ providerId, oauthVerifier }, this.onAuthorizeCompleted, this.onAuthorizeError);
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
    this.props.router.push(`/brokers/${broker.slug}/${serviceProvider.slug}/`);
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
                  disabled={this.state.loading}
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

export default withRouter(Verify);
