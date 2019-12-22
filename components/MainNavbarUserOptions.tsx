import React from 'react';

import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { graphql, Variables } from 'react-relay';
import { withRelay } from './RelayComponent';
import { MainNavbarUserOptionsQueryResponse } from '../__generated__/MainNavbarUserOptionsQuery.graphql';

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

  render(): React.ReactElement {
    const { viewer } = this.props;
    return (
      <>
        <span css={{ marginRight: 8 }}>
          <strong>{viewer.credentials.fullName}</strong>
        </span>
        <Button minimal icon={IconNames.USER} />
      </>
    );
  }
}

export default withRelay<PropsType>(MainNavbarUserOptions);
