import React, { Component } from "react";
import { HTMLSelect, IOptionProps, Callout } from "@blueprintjs/core";
import { Flex, Box } from "rebass";
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay";
import { OrderList_viewer } from "../../__generated__/OrderList_viewer.graphql";
import OrderListItem from "./OrderListItem";
import ErrorState from "../generic/ErrorState";
import { IconNames } from "@blueprintjs/icons";

interface Props {
  relay: RelayRefetchProp;
  viewer: OrderList_viewer;
  providerId: string;
  autoRefetch?: boolean;
}

interface State {
  statusOptions: IOptionProps[];
  selectedStatus: IOptionProps["value"];
  refetchError: Error | null;
}

class OrderList extends Component<Props, State> {
  static defaultProps = {
    autoRefetch: true
  };

  timeoutId: number | null = null;

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
      selectedStatus: statusOptions[0].value,
      refetchError: null
    };
  }

  componentDidMount() {
    if (this.props.autoRefetch) {
      this.timeoutId = setInterval(this.refresh, 2000);
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) clearInterval(this.timeoutId);
  }

  refresh = () => {
    this.props.relay.refetch(fragmentVariables => fragmentVariables, null, this.refetchDone, { force: true });
  };

  refetchDone = (error?: Error | null) => {
    if (error && !this.state.refetchError) {
      this.setState({ refetchError: error });
    } else if (!error && this.state.refetchError) {
      this.setState({ refetchError: null });
    }
  };

  render() {
    const { viewer, providerId } = this.props;
    const { statusOptions, selectedStatus, refetchError } = this.state;

    return (
      <Flex flexDirection="column" width={[1]}>
        <Flex justifyContent="space-between" alignItems="center">
          <h3>Orders</h3>
          <HTMLSelect options={statusOptions} value={selectedStatus} />
        </Flex>
        {refetchError ? (
          <ErrorState title="Error fetching orders" description={refetchError.message} />
        ) : (
          <Box css={{ "> div": { marginBottom: 4 } }}>
            {viewer.orders.length > 0 ? (
              viewer.orders.map((order, idx) => <OrderListItem key={idx} order={order} providerId={providerId} />)
            ) : (
              <Callout icon={IconNames.INBOX}>No orders to show at this moment...</Callout>
            )}
          </Box>
        )}
      </Flex>
    );
  }
}

export default createRefetchContainer(
  OrderList,
  {
    viewer: graphql`
      fragment OrderList_viewer on ViewerType
        @argumentDefinitions(providerId: { type: "ID!" }, accountId: { type: "ID" }) {
        orders(providerId: $providerId, accountId: $accountId) {
          ...OrderListItem_order
        }
      }
    `
  },
  graphql`
    query OrderListRefetchQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...OrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `
);
