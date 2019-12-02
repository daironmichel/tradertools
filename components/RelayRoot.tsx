import React from "react";
import { QueryRenderer, GraphQLTaggedNode } from "react-relay";
import "../scss/styles.scss";

import { createEnvironment } from "../relay";

interface RootQueryComponent extends React.ComponentClass {
  query: GraphQLTaggedNode;
}

interface Props {
  Component: RootQueryComponent;
  variables: any;
}

export default class RelayRoot extends React.Component<Props> {
  render(): React.ReactElement<any> {
    const { Component, variables = {} } = this.props;
    const environment = createEnvironment();

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={variables}
        render={({ error, props }) => {
          if (error) return <div>{error.message}</div>;
          else if (props) return <Component {...props} />;
          return <div>Loading</div>;
        }}
      />
    );
  }
}
