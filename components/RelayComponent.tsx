import React from 'react';
import { QueryRenderer, GraphQLTaggedNode, Variables } from 'react-relay';
import '../scss/styles.scss';

import { createEnvironment } from '../relay';
import { NextPageContext } from 'next';
import ErrorPage from '../pages/_error';
import Loading from './generic/Loading';
import { Flex } from 'rebass';
import ErrorState from './generic/ErrorState';

interface PropsWithVars {
  variables?: Variables;
}

interface RootQueryComponent<P extends PropsWithVars = {}, S = unknown> extends React.ComponentClass<P, S> {
  query: GraphQLTaggedNode;
  getInitialProps?: (ctx: NextPageContext) => Promise<{ [name: string]: {} } | null | undefined>;
}

interface Props extends PropsWithVars {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: RootQueryComponent<any>;
}

interface RenderProps {
  error: Error | null;
  props: unknown;
  retry: (() => void) | null;
}

export default class RelayComponent extends React.Component<Props> {
  render(): JSX.Element {
    const { Component, variables = {}, ...rest } = this.props;
    const environment = createEnvironment();

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={variables}
        render={(renderProps: RenderProps): React.ReactNode => {
          const { error, props } = renderProps;
          if (error && error.message !== 'NO_RELAY_SSR') {
            if (error.constructor.name === 'RRNLRequestError') {
              return (
                <ErrorState
                  title="Relay Request Error"
                  description={<pre css={{ whiteSpace: 'pre-line' }}>{error.message}</pre>}
                />
              );
            }
            return <ErrorPage description={error.message} />;
          } else if (props) return <Component variables={variables} {...props} {...rest} />;
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

interface RelayComponentProps extends PropsWithVars {
  url?: unknown; // this is a deprecated nextjs prop for pages
}

interface PageInitialProps extends PropsWithVars {
  [name: string]: unknown;
}

export function withRelay<P>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: RootQueryComponent<any>,
  asPage = false,
): React.FunctionComponent<RelayComponentProps & P> {
  const wrapper = (props: RelayComponentProps & P): JSX.Element => {
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
        ...componentProps,
      };
    };
  }

  return wrapper;
}
