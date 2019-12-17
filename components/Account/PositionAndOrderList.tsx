import React, { Component } from "react";
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay";
import { PositionAndOrderList_viewer } from "../../__generated__/PositionAndOrderList_viewer.graphql";
import PositionList from "./PositionList";
import OrderList from "../Order/OrderList";
import ErrorState from "../generic/ErrorState";

interface Props {
  relay: RelayRefetchProp;
  viewer: PositionAndOrderList_viewer;
  providerId: string;
  autoRefetch?: boolean;
}

interface State {
  refetchError: Error | null;
}

class PositionAndOrderList extends Component<Props, State> {
  static defaultProps = {
    autoRefetch: true
  };

  timeoutId: number | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
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
    const { refetchError } = this.state;

    return refetchError ? (
      <ErrorState title="Error fetching positions" description={refetchError.message} />
    ) : (
      <>
        <PositionList viewer={viewer} providerId={providerId} autoRefetch={false} />
        <OrderList viewer={viewer} providerId={providerId} autoRefetch={false} />
      </>
    );
  }
}

export default createRefetchContainer(
  PositionAndOrderList,
  {
    viewer: graphql`
      fragment PositionAndOrderList_viewer on ViewerType
        @argumentDefinitions(providerId: { type: "ID!" }, accountId: { type: "ID" }) {
        ...PositionList_viewer @arguments(providerId: $providerId, accountId: $accountId)
        ...OrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    `
  },
  graphql`
    query PositionAndOrderListRefetchQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...PositionList_viewer @arguments(providerId: $providerId, accountId: $accountId)
        ...OrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `
);
