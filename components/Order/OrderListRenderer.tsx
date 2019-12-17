import React, { Component } from "react";
import { graphql } from "react-relay";
import {
  OrderListRendererQueryResponse,
  OrderListRendererQueryVariables
} from "../../__generated__/OrderListRendererQuery.graphql";
import OrderList from "./OrderList";
import { withRelay } from "../RelayComponent";

interface RendererProps {
  variables: OrderListRendererQueryVariables;
}

class OrderListRenderer extends Component<RendererProps & OrderListRendererQueryResponse> {
  static query = graphql`
    query OrderListRendererQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...OrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `;

  render() {
    return <OrderList viewer={this.props.viewer} providerId={this.props.variables.providerId} />;
  }
}

export default withRelay<RendererProps>(OrderListRenderer);
