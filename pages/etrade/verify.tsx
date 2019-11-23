import { jsx, css } from "@emotion/core";
import React, { SyntheticEvent } from "react";
import Head from "next/head";
import router from "next/router";
import Themed from "../../components/Themed";
import { Flex, Box } from "rebass";
import { Button, Card, InputGroup, Icon, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import EtradeAPI from "../../api/etrade-client-api";

interface State {
  code: string;
  loading: boolean;
}

class Verify extends React.Component<{}, State> {
  etradeApi: EtradeAPI;

  constructor(props: any) {
    super(props);
    this.etradeApi = new EtradeAPI();

    this.state = {
      code: "",
      loading: false
    };
  }

  _handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.loading) return;
    this.setState({ loading: true });
    this.etradeApi.verify(this.state.code).then(() => {
      this.setState({ loading: false });
      router.push("/");
    });
  };

  _handleCodeChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ code: e.currentTarget.value });
  };

  render() {
    return (
      <Themed>
        <Head>
          <title>Etrade Verify</title>
        </Head>
        <Flex justifyContent="center" alignItems="center" height="100vh">
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
                  leftIcon="user"
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
                  <Button type="submit" large fill text="Verify" loading={this.state.loading} />
                </Flex>
              </form>
            </Card>
          </Box>
        </Flex>
      </Themed>
    );
  }
}

export default Verify;
