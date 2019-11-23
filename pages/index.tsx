import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { css } from "@emotion/core";
import { graphql } from "react-relay";
import { H2, AnchorButton } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../components/Layout";
import { pages_indexQueryResponse } from "./__generated__/pages_indexQuery.graphql";

interface Props extends pages_indexQueryResponse {}

class Index extends React.Component<Props> {
  static query = graphql`
    query pages_indexQuery {
      viewer {
        credentials {
          databaseId
          fullName
        }
      }
    }
  `;

  // query {
  //   viewer {
  //     brokers {
  //       id
  //       databaseId
  //       name
  //       serviceProviders {
  //         edges {
  //           node {
  //             id
  //             databaseId
  //             name
  //             protocol
  //             session {
  //               status
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  render() {
    const { viewer } = this.props;
    return (
      <Layout>
        <Head>
          <title>Home</title>
        </Head>

        <H2
          css={css`
            text-align: center;
            margin: 30px auto;
          `}
        >
          Welcome {viewer.credentials.fullName}
        </H2>
        <Flex justifyContent="center" alignItems="center">
          <Link href="api/etrade/oauth" passHref>
            <AnchorButton text="ETRADE" />
          </Link>
        </Flex>
      </Layout>
    );
  }
}

export default Index;
