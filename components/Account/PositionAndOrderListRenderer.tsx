import React, { Component } from "react";
import { graphql } from "react-relay";
import {
  PositionAndOrderListRendererQueryResponse,
  PositionAndOrderListRendererQueryVariables
} from "./__generated__/PositionAndOrderListRendererQuery.graphql";
import { withRelay } from "../RelayComponent";
import PositionAndOrderList from "./PositionAndOrderList";

interface RendererProps {
  variables: PositionAndOrderListRendererQueryVariables;
  autoRefetch?: boolean;
}

class PositionAndOrderListRenderer extends Component<RendererProps & PositionAndOrderListRendererQueryResponse> {
  static defaultProps = {
    autoRefetch: false
  };

  static query = graphql`
    query PositionAndOrderListRendererQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...PositionAndOrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `;

  render() {
    return (
      <PositionAndOrderList
        viewer={this.props.viewer}
        providerId={this.props.variables.providerId}
        autoRefetch={this.props.autoRefetch}
      />
    );
  }
}

export default withRelay<RendererProps>(PositionAndOrderListRenderer);
