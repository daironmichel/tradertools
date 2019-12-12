import React, { ComponentPropsWithoutRef } from "react";
import { QueryRenderer, GraphQLTaggedNode, Variables, createFragmentContainer } from "react-relay";
import "../scss/styles.scss";

import { createEnvironment } from "../relay";
import { NextPageContext } from "next";
import ErrorPage from "../pages/_error";
import Loading from "./generic/Loading";
import { Flex } from "rebass";
import ErrorState from "./generic/ErrorState";

interface RootQueryComponent<P = any, S = any> extends React.ComponentClass<P, S> {
  query: GraphQLTaggedNode;
  getInitialProps?: (ctx: NextPageContext) => Promise<{ [name: string]: any } | null | undefined>;
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
    const { Component, variables = {}, ...rest } = this.props;
    const environment = createEnvironment();

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={variables}
        render={(renderProps: RenderProps) => {
          const { error, props } = renderProps;
          if (error && error.message !== "NO_RELAY_SSR") {
            console.log(renderProps);
            if (error.constructor.name === "RRNLRequestError") {
              return (
                <ErrorState
                  title="Relay Request Error"
                  description={<pre css={{ whiteSpace: "pre-line" }}>{error.message}</pre>}
                />
              );
            }
            return <ErrorPage description={error.message} />;
          } else if (props) return <Component {...props} />;
          return (
            <Flex flex="1" justifyContent="center" alignItems="center">
              <Loading />
            </Flex>
          );
        }}
      />
    );
  }
}

interface RelayComponentProps {
  variables?: Variables;
  url?: any; // this is a deprecated nextjs prop for pages
}

interface PageInitialProps {
  variables?: Variables;
  [name: string]: any;
}

export function withRelay<P>(
  component: RootQueryComponent,
  asPage: boolean = false
): React.FunctionComponent<RelayComponentProps & P> {
  const wrapper = (props: RelayComponentProps & P) => {
    const {
      variables,
      // url, // we unpack this here and ignore it since its deprecated
      ...rest
    } = props;

    return <RelayComponent Component={component} variables={variables} {...rest} />;
  };

  wrapper.displayName = `WithRelay${component.displayName}`;

  if (asPage) {
    wrapper.getInitialProps = async (context: NextPageContext): Promise<PageInitialProps> => {
      const { query: variables } = context;
      let componentProps;
      if (component.getInitialProps) {
        componentProps = await component.getInitialProps(context);
      }

      return {
        variables,
        ...componentProps
      };
    };
  }

  return wrapper;
}
