import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { graphql } from "react-relay";
import { ButtonGroup, Button, AnchorButton } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../components/Layout";
import { pages_indexQueryResponse } from "./__generated__/pages_indexQuery.graphql";

interface Props extends pages_indexQueryResponse {}

class Index extends React.Component<Props> {
  static query = graphql`
    query pages_indexQuery {
      viewer {
        brokers {
          id
          databaseId
          name
          serviceProviders {
            edges {
              node {
                id
                databaseId
                name
                protocol
                session {
                  status
                }
              }
            }
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
          <h4>SELECT BROKER</h4>
          <ButtonGroup vertical large>
            {viewer.brokers.map(broker => (
              <Link href="/brokers/[brokerId]/" as="/brokers/1/" passHref>
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
