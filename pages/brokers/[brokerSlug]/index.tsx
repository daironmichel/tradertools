import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { graphql } from "react-relay";
import { ButtonGroup, AnchorButton } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../../../components/Layout";
import { BrokerSlugQueryResponse } from "./__generated__/BrokerSlugQuery.graphql";
import Error from "../../_error";
import NonIdealConnection from "../../../components/generic/NonIdealConnection";
import { withRelay } from "../../../components/RelayComponent";

interface Props extends BrokerSlugQueryResponse {}

class Index extends React.Component<Props> {
  static query = graphql`
    query BrokerSlugQuery($brokerSlug: String!) {
      viewer {
        broker(slug: $brokerSlug) {
          id
          databaseId
          name
          slug
          serviceProviders {
            edges {
              node {
                id
                databaseId
                name
                slug
              }
            }
          }
        }
      }
    }
  `;

  render() {
    const { viewer } = this.props;
    const { broker } = viewer;
    const { serviceProviders } = broker || {};

    if (!broker) {
      return <Error title="Not Found" description="There's nothing to see here." />;
    }

    return (
      <Layout>
        <Head>
          <title>{broker.name}</title>
        </Head>

        <Flex justifyContent="center" alignItems="center" flexDirection="column" flex="1">
          <NonIdealConnection
            connection={serviceProviders}
            description="There are no providers configured for this broker."
          >
            <h4>SELECT PROVIDER</h4>
            <ButtonGroup vertical large>
              {serviceProviders &&
                serviceProviders.edges.map(provider => (
                  <Link
                    key={provider.node.id}
                    href="/brokers/[brokerSlug]/[providerSlug]/"
                    as={`/brokers/${broker.slug}/${provider.node.slug}/`}
                    passHref
                  >
                    <AnchorButton text={provider.node.name} />
                  </Link>
                ))}
            </ButtonGroup>
          </NonIdealConnection>
        </Flex>
      </Layout>
    );
  }
}

export default withRelay(Index, true);
