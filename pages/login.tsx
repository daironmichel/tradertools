/** @jsx jsx */
import { jsx, css } from '@emotion/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import Head from 'next/head';
import Themed from '../components/Themed';
import { Flex, Box } from 'rebass';
import { Button, Card, InputGroup, Icon, Classes, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useRouter } from 'next/router';

const Login = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    const sessionCookie = document.cookie.match(/;*\s*sid\s*=/);
    if (!sessionCookie) return;
    let next = null;
    if (router.asPath.includes('?')) {
      const queryString = router.asPath.substr(router.asPath.indexOf('?'));
      const urlParams = new URLSearchParams(queryString);
      next = urlParams.get('next');
    }

    if (!next) return;

    router.push(next);
  }, []);

  return (
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
              {next && <input type="hidden" name="next" value={next} />}
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
                  marginLeft: 'auto',
                }}
              >
                <Button type="submit" large fill intent={Intent.PRIMARY}>
                  Login
                </Button>
              </Flex>
            </form>
          </Card>
        </Box>
      </Flex>
    </Themed>
  );
};

export default Login;
