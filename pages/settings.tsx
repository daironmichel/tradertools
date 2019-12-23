import { css } from '@emotion/core';
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Flex, Box } from 'rebass';
import { Button, Card, Intent, NumericInput, Icon, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { graphql } from 'relay-runtime';
import Layout from '../components/Layout';
import { withRelay } from '../components/RelayComponent';
import { settingsQueryResponse } from '../__generated__/settingsQuery.graphql';
import SaveSettingsMutation from '../mutations/UserSettings/SaveSettingsMutation';

interface State {
  refreshRate: number;
  loading: boolean;
}

type Props = {} & settingsQueryResponse;

class Settings extends React.Component<Props, State> {
  static query = graphql`
    query settingsQuery {
      viewer {
        settings {
          refreshRate
          # defaultBroker {
          #   databaseId
          #   name
          #   defaultProvider {
          #     databaseId
          #     slug
          #     accountKey
          #   }
          # }
        }
        # brokers {
        #   databaseId
        #   name
        # }
        # serviceProviders {
        #   databaseId
        #   name
        # }
        # accounts {
        #   databaseId
        #   name
        # }
      }
    }
  `;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshRate: props.viewer.settings?.refreshRate || 0,
      loading: false,
    };
  }

  _handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { refreshRate } = this.state;
    this.saveSettings(refreshRate);
  };

  _handleSubmitOnClick = (): void => {
    const { refreshRate } = this.state;
    this.saveSettings(refreshRate);
  };

  saveSettings = (refreshRate: number): void => {
    this.setState({ loading: true });
    const save = new SaveSettingsMutation();
    save.commit({ refreshRate }, this.onSaveCompleted, this.onSaveError);
  };

  onSaveCompleted = (): void => {
    this.setState({ loading: false });
  };

  onSaveError = (): void => {
    this.setState({ loading: false });
  };

  _handleRefreshRateChange = (valueAsNumber: number): void => {
    this.setState({ refreshRate: valueAsNumber });
  };

  _handleGoBack = (): void => {
    Router.back();
  };

  render(): JSX.Element {
    return (
      <Layout>
        <Head>
          <title>Settings</title>
        </Head>
        <Flex justifyContent="center" alignItems="center" flex="1">
          <Box width="100%" px={2} maxWidth={400}>
            <Card
              css={css`
                box-shadow: none;
                background-color: transparent;
              `}
            >
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <h1 className={Classes.TEXT_MUTED}>
                  <Icon icon={IconNames.COG} iconSize={30} /> Settings
                </h1>
                <Button minimal icon={IconNames.CROSS} onClick={this._handleGoBack} />
              </Flex>
              <form method="POST" onSubmit={this._handleSubmit}>
                <NumericInput
                  fill
                  id="refreshRate"
                  name="refreshRate"
                  placeholder="refreshRate"
                  autoComplete="refreshRate"
                  disabled={this.state.loading}
                  large
                  value={this.state.refreshRate}
                  onValueChange={this._handleRefreshRateChange}
                  css={css`
                    margin-bottom: 10px;
                  `}
                />
                <Flex
                  justifyContent="center"
                  css={{
                    marginTop: 20,
                    marginLeft: 'auto',
                  }}
                >
                  <Button
                    type="submit"
                    intent={Intent.PRIMARY}
                    large
                    fill
                    text="Save"
                    loading={this.state.loading}
                    onClick={this._handleSubmitOnClick}
                    css={{ minWidth: 100, marginRight: 15 }}
                  />
                  <Button
                    large
                    fill
                    text="Go Back"
                    loading={this.state.loading}
                    onClick={this._handleGoBack}
                    css={{ minWidth: 100 }}
                  />
                </Flex>
              </form>
            </Card>
          </Box>
        </Flex>
      </Layout>
    );
  }
}

export default withRelay(Settings, true);
