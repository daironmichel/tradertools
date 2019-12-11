import React from "react";
import Themed from "../components/Themed";
import Head from "next/head";
import { Flex } from "rebass";
import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { NextPageContext } from "next";

interface Props {
  statusCode?: string | number | null;
  title?: string;
  description?: string;
}

function Error(props: Props) {
  const { statusCode, title, description } = props;
  if (statusCode) {
    // error on the server
  }
  // else, error on the client
  return (
    <Themed>
      <Head>
        <title>Login</title>
      </Head>
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <NonIdealState
          icon={IconNames.ERROR}
          title={title || `Unhandled Error ${statusCode || 404}`}
          description={description}
        />
      </Flex>
    </Themed>
  );
}

Error.getInitialProps = (context: NextPageContext) => {
  const { res, err } = context;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
