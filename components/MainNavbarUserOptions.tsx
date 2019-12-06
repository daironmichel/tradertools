import React from "react";

import { Button, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { graphql } from "react-relay";
import { withRelay } from "./RelayComponent";
import { MainNavbarUserOptionsQueryResponse } from "./__generated__/MainNavbarUserOptionsQuery.graphql";

interface Props extends MainNavbarUserOptionsQueryResponse {
  testProp: any;
}

class MainNavbarUserOptions extends React.Component<Props> {
  static query = graphql`
    query MainNavbarUserOptionsQuery {
      viewer {
        credentials {
          databaseId
          fullName
        }
      }
    }
  `;

  render(): React.ReactElement<any> {
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

export default withRelay(MainNavbarUserOptions);
