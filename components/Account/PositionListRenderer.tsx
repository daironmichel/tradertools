import React, { Component } from "react";
import { graphql } from "react-relay";
import {
  PositionListRendererQueryResponse,
  PositionListRendererQueryVariables
} from "./__generated__/PositionListRendererQuery.graphql";
import PositionList from "./PositionList";
import { withRelay } from "../RelayComponent";

interface RendererProps {
  variables: PositionListRendererQueryVariables;
}

class PositionListRenderer extends Component<RendererProps & PositionListRendererQueryResponse> {
  static query = graphql`
    query PositionListRendererQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...PositionList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `;

  render() {
    return <PositionList viewer={this.props.viewer} providerId={this.props.variables.providerId} />;
  }
}

export default withRelay<RendererProps>(PositionListRenderer);
