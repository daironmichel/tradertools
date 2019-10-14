/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import Themed from "../components/Themed";
import { Flex, Box } from "rebass";
import { Button, Card, Elevation, InputGroup } from "@blueprintjs/core";

const Login = () => (
  <Themed>
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box width={[1, 1 / 2, 1 / 2, 1 / 4, 1 / 6]} px={2}>
        <Card elevation={Elevation.TWO}>
          <h2 style={{ marginTop: 0 }}>Login</h2>
          <form action="/login" method="POST">
            <InputGroup
              leftIcon="user"
              id="username"
              name="username"
              placeholder="username"
              large
              css={css`
                margin-bottom: 10px;
              `}
            />
            <InputGroup
              leftIcon="lock"
              type="password"
              id="password"
              name="password"
              placeholder="password"
              large
              css={css`
                margin-bottom: 10px;
              `}
            />
            <Flex
              justifyContent="flex-end"
              sx={{
                marginTop: 20,
                marginLeft: "auto"
              }}
            >
              <Button type="submit" large>
                Submit
              </Button>
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  </Themed>
);

export default Login;
