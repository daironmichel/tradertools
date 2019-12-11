import React from "react";
import { QueryRenderer /*, fetchQuery*/ } from "react-relay";
import NextApp from "next/app";
// import "../scss/styles.scss";
import Error from "./_error";
import Loading from "../components/generic/Loading";

import { /*initEnvironment, */ createEnvironment } from "../relay";

export default class App extends NextApp {
  // static getInitialProps = async ({ Component, ctx /*, router */ }) => {
  //   const { variables } = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  //   try {
  //     if (initEnvironment && Component.query) {
  //       const { environment, relaySSR } = initEnvironment();

  //       await fetchQuery(environment, Component.query, variables);

  //       return {
  //         variables,
  //         relayData: await relaySSR.getCache()
  //       };
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }

  //   return {
  //     variables
  //   };
  // };

  render() {
    const { Component, router /*, relayData*/ } = this.props;
    // const query = Component.query ? Component.query() : {};
    const environment = createEnvironment();
    // relayData
    // JSON.stringify({
    //   // queryID: Component.query ? Component.query().params.name : undefined,
    //   queryID: Component.query ? Component.query().default.hash : undefined,
    //   variables
    // })

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={router.query}
        render={({ error, props }) => {
          if (error && error.message !== "NO_RELAY_SSR") {
            return <Error description={error.message} />;
          } else if (props) return <Component {...props} />;
          return <Loading />;
        }}
      />
    );
  }
}
