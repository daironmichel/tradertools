import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { graphql } from 'react-relay';
import { ButtonGroup, AnchorButton } from '@blueprintjs/core';
import { Flex } from 'rebass';
import Layout from '../components/Layout';
import { pagesIndexQueryResponse } from '../__generated__/pagesindexQuery.graphql';
import { withRelay } from '../components/RelayComponent';

type Props = {} & pagesIndexQueryResponse;

class Index extends React.Component<Props> {
  static query = graphql`
    query pagesIndexQuery {
      viewer {
        brokers {
          id
          name
          slug
        }
      }
    }
  `;

  render(): JSX.Element {
    const { viewer } = this.props;
    return (
      <Layout>
        <Head>
          <title>Home</title>
        </Head>

        <Flex justifyContent="center" alignItems="center" flexDirection="column" flex="1">
          <h4>SELECT BROKER</h4>
          <ButtonGroup vertical large>
            {viewer.brokers.map(broker => (
              <Link key={broker.id} href="/brokers/[brokerSlug]/" as={`/brokers/${broker.slug}/`} passHref>
                <AnchorButton key={broker.id} text={broker.name} />
              </Link>
            ))}
          </ButtonGroup>
        </Flex>
      </Layout>
    );
  }
}

export default withRelay(Index, true);
