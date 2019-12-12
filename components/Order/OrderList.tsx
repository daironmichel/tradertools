import React, { Component } from "react";
import { Card, HTMLSelect, IOptionProps } from "@blueprintjs/core";
import { Flex, Box } from "rebass";
import { createRefetchContainer, graphql, RelayRefetchProp, Variables } from "react-relay";
import { OrderList_viewer } from "./__generated__/OrderList_viewer.graphql";
import OrderListItem from "./OrderListItem";

interface Props {
  relay: RelayRefetchProp;
  viewer: OrderList_viewer;
}

interface State {
  statusOptions: IOptionProps[];
  selectedStatus: IOptionProps["value"];
}

class OrderList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const statusOptions = [
      { label: "ALL", value: "ALL" },
      { label: "PENDING", value: "PENDING" },
      { label: "REJECTED", value: "REJECTED" },
      { label: "EXECUTED", value: "EXECUTED" }
    ];

    this.state = {
      statusOptions: statusOptions,
      selectedStatus: statusOptions[0].value
    };
  }
  render() {
    const { viewer } = this.props;
    const { statusOptions, selectedStatus } = this.state;
    return (
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center">
          <h3>Orders</h3>
          <HTMLSelect options={statusOptions} value={selectedStatus} />
        </Flex>
        <Box css={{ "> div": { marginBottom: 4 } }}>
          {viewer.orders.map((order, idx) => (
            <OrderListItem key={idx} order={order} />
          ))}
        </Box>
      </Flex>
    );
  }
}

export default createRefetchContainer(
  OrderList,
  {
    viewer: graphql`
      fragment OrderList_viewer on ViewerType
        @argumentDefinitions(providerId: { type: "ID" }, accountId: { type: "ID" }) {
        orders(providerId: $providerId, accountId: $accountId) {
          ...OrderListItem_order
        }
      }
    `
  },
  graphql`
    query OrderListRefetchQuery($providerId: ID!, $accountId: ID!) {
      viewer {
        ...OrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `
);
