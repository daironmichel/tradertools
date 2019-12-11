/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import Head from "next/head";
import Themed from "../components/Themed";
import { Flex, Box } from "rebass";
import { Button, Card, InputGroup, Icon, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

const Login = () => (
  <Themed>
    <Head>
      <title>Login</title>
    </Head>
    <Flex justifyContent="center" alignItems="center" height="100vh" flex="1">
      <Box width="100%" px={2} maxWidth={400}>
        <Card
          css={css`
            box-shadow: none;
            background-color: transparent;
          `}
        >
          <Flex justifyContent="center" alignItems="center" mb={40} mt={-80}>
            <Icon icon={IconNames.LOCK} iconSize={164} className={Classes.TEXT_DISABLED} />
          </Flex>
          <form action="/login" method="POST">
            <InputGroup
              leftIcon="user"
              id="username"
              name="username"
              placeholder="username"
              autoComplete="username"
              large
              css={css`
                margin-bottom: 10px;
              `}
            />
            <InputGroup
              leftIcon="key"
              type="password"
              id="password"
              name="password"
              placeholder="password"
              autoComplete="current-password"
              large
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
              <Button type="submit" large fill>
                Login
              </Button>
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  </Themed>
);

export default Login;
