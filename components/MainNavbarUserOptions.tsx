import React from 'react';

import { Button, Popover, Menu } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { graphql, Variables } from 'react-relay';
import { withRelay } from './RelayComponent';
import { MainNavbarUserOptionsQueryResponse } from '../__generated__/MainNavbarUserOptionsQuery.graphql';
import Router from 'next/router';

type PropsType = {
  variables?: Variables;
};

class MainNavbarUserOptions extends React.Component<PropsType & MainNavbarUserOptionsQueryResponse> {
  static query = graphql`
    query MainNavbarUserOptionsQuery {
      viewer {
        credentials {
          fullName
        }
      }
    }
  `;

  handleSettingsOnClick = (): void => {
    Router.push('/settings');
  };

  render(): React.ReactElement {
    const { viewer } = this.props;
    return (
      <>
        <span css={{ marginRight: 8 }}>
          <strong>{viewer.credentials.fullName}</strong>
        </span>
        <Popover
          content={
            <Menu>
              <Menu.Item
                key="settingsMenuItem"
                icon={IconNames.COG}
                text="Settings"
                onClick={this.handleSettingsOnClick}
              />
            </Menu>
          }
        >
          <Button minimal icon={IconNames.USER} />
        </Popover>
      </>
    );
  }
}

export default withRelay<PropsType>(MainNavbarUserOptions);
