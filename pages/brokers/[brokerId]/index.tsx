import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { graphql } from "react-relay";
import { ButtonGroup, Button, AnchorButton } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../../../components/Layout";
import { BrokerIdQueryResponse } from "./__generated__/BrokerIdQuery.graphql";

interface Props extends BrokerIdQueryResponse {}

class Index extends React.Component<Props> {
  static query = graphql`
    query BrokerIdQuery($nodeId: ID!) {
      node(id: $nodeId) {
        ... on BrokerNode {
          serviceProviders {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  `;

  render() {
    const { node } = this.props;
    const { serviceProviders } = node;
    return (
      <Layout>
        <Head>
          <title>Home</title>
        </Head>

        <Flex justifyContent="center" alignItems="center" flexDirection="column">
          <h4>SELECT PROVIDER</h4>
          <ButtonGroup vertical large>
            {serviceProviders.edges.map(provider => (
              <Link href="" as="" passHref>
                <AnchorButton key={provider.node.id} text={provider.node.name} />
              </Link>
            ))}
          </ButtonGroup>
        </Flex>
      </Layout>
    );
  }
}

export default Index;
