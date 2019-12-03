import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { graphql } from "react-relay";
import { ButtonGroup, Button, AnchorButton } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../../../../components/Layout";
import { pages_indexQueryResponse } from "./__generated__/pages_indexQuery.graphql";

interface Props extends pages_indexQueryResponse {}

class Index extends React.Component<Props> {
  static query = graphql`
    query ProviderIdQuery($nodeId: ID!) {
      node(id: $nodeId) {
        ... on ServiceProviderNode {
          id
          name
          session {
            id
            status
          }
        }
      }
    }
  `;

  render() {
    const { viewer } = this.props;
    return (
      <Layout>
        <Head>
          <title>Home</title>
        </Head>

        <Flex justifyContent="center" alignItems="center" flexDirection="column">
          <h4>SELECT PROVIDER</h4>
          <ButtonGroup vertical large>
            {viewer.brokers.map(broker => (
              <Link href="" as="" passHref>
                <AnchorButton key={broker.id} text={broker.name} />
              </Link>
            ))}
          </ButtonGroup>
        </Flex>
      </Layout>
    );
  }
}

export default Index;
