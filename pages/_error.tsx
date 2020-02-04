import React from 'react';
import Themed from '../components/Themed';
import Head from 'next/head';
import { Flex } from 'rebass';
import { NextPageContext } from 'next';
import ErrorState from '../components/generic/ErrorState';

interface Props {
  statusCode?: string | number | null;
  title?: string;
  description?: string;
}

function ErrorPage(props: Props): JSX.Element {
  const { statusCode = 404, title = 'Page not found', description } = props;
  if (statusCode) {
    // error on the server
  }
  // else, error on the client
  return (
    <Themed>
      <Head>
        <title>Error</title>
      </Head>
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <ErrorState statusCode={statusCode} title={title} description={description} />
      </Flex>
    </Themed>
  );
}

ErrorPage.getInitialProps = (context: NextPageContext): {} => {
  const { res, err } = context;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
