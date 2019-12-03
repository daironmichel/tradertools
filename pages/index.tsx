import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { css } from "@emotion/core";
import { graphql } from "react-relay";
import { H2, ButtonGroup, Button } from "@blueprintjs/core";
import { Flex } from "rebass";
import Layout from "../components/Layout";
import { pages_indexQueryResponse } from "./__generated__/pages_indexQuery.graphql";

interface Props extends pages_indexQueryResponse {}

interface State {
  activeBrokerId: number | null;
}

class Index extends React.Component<Props, State> {
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

  constructor(props: Props) {
    super(props);

    this.state = {
      activeBrokerId: null
    };
  }

  _brokerButtonOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ activeBrokerId: Number(e.currentTarget.value) });
  };

  render() {
    const { viewer } = this.props;
    return (
      <Layout>
        <Head>
          <title>Home</title>
        </Head>

        <span
          css={css`
            text-align: center;
            margin: 30px auto;
          `}
        >
          SELECT BROKER
        </span>
        <Flex justifyContent="center" alignItems="center">
          <ButtonGroup minimal>
            {viewer.brokers.map(broker => (
              <Button
                key={broker.id}
                text={broker.name}
                active={this.state.activeBrokerId === broker.databaseId}
                onClick={this._brokerButtonOnClick}
                value={broker.databaseId}
              />
            ))}
          </ButtonGroup>
        </Flex>
      </Layout>
    );
  }
}

export default Index;
