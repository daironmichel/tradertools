import React, { ComponentPropsWithoutRef } from "react";
import { QueryRenderer, GraphQLTaggedNode, Variables, createFragmentContainer } from "react-relay";
import "../scss/styles.scss";

import { createEnvironment } from "../relay";

interface RootQueryComponent<P = any, S = any> extends React.ComponentClass<P, S> {
  query: GraphQLTaggedNode;
  getInitialProps?: () => Promise<{ variables?: Variables }>;
}

interface Props {
  Component: RootQueryComponent;
  variables?: Variables;
}

interface RenderProps {
  error: Error | null;
  props: any;
  retry: (() => void) | null;
}

export default class RelayComponent extends React.Component<Props> {
  render(): React.ReactElement<any> {
    const { Component, variables = {} } = this.props;
    const environment = createEnvironment();

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={variables}
        render={(renderProps: RenderProps) => {
          const { error, props } = renderProps;
          if (error) return <div>{error.message}</div>;
          else if (props) return <Component {...props} />;
          return <div>Loading</div>;
        }}
      />
    );
  }
}

interface RelayComponentProps {
  variables?: Variables;
}

export function withRelay(component: RootQueryComponent): React.FunctionComponent<RelayComponentProps> {
  const wrapper = (props: RelayComponentProps) => {
    return <RelayComponent Component={component} variables={props.variables} />;
  };

  // if (component.getInitialProps) {
  //   wrapper.getInitialProps = async () => Promise<any> {
  //     const props = await
  //   };
  // }

  return wrapper;
}
