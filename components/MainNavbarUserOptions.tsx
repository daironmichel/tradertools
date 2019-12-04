import React from "react";

import { Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { graphql } from "react-relay";
import RelayRoot from "./RelayRoot";
import { MainNavbarUserOptionsQueryResponse } from "./__generated__/MainNavbarUserOptionsQuery.graphql";

interface Props extends MainNavbarUserOptionsQueryResponse {}

class UserOptions extends React.Component<Props> {
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
    return (
      <>
        <span css={{ marginRight: 8 }}>
          <strong>{this.props.viewer.credentials.fullName}</strong>
        </span>
        <Button minimal icon={IconNames.USER} />
      </>
    );
  }
}

const MainNavbarUserOptions = () => {
  return <RelayRoot Component={UserOptions} />;
};

export default MainNavbarUserOptions;
