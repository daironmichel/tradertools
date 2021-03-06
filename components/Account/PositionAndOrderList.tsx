/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react';
import { createRefetchContainer, graphql, RelayRefetchProp } from 'react-relay';
import { PositionAndOrderList_viewer } from '../../__generated__/PositionAndOrderList_viewer.graphql';
import PositionList from './PositionList';
import OrderList from '../Order/OrderList';
import ErrorState from '../generic/ErrorState';

interface Props {
  relay: RelayRefetchProp;
  viewer: PositionAndOrderList_viewer;
  providerId: string;
  selectedStrategyId?: number;
  autoRefetch?: number;
}

interface State {
  refetchError: Error | null;
}

class PositionAndOrderList extends Component<Props, State> {
  static defaultProps = {
    autoRefetch: 0,
  };

  timeoutId: number | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      refetchError: null,
    };
  }

  componentDidMount(): void {
    if (this.props.autoRefetch && this.props.autoRefetch > 0) {
      this.timeoutId = setInterval(this.refresh, this.props.autoRefetch);
    }
  }

  componentWillUnmount(): void {
    if (this.timeoutId) clearInterval(this.timeoutId);
  }

  refresh = (): void => {
    this.props.relay.refetch(fragmentVariables => fragmentVariables, null, this.refetchDone, { force: true });
  };

  refetchDone = (error?: Error | null): void => {
    if (error && !this.state.refetchError) {
      this.setState({ refetchError: error });
    } else if (!error && this.state.refetchError) {
      this.setState({ refetchError: null });
    }
  };

  render(): JSX.Element {
    const { viewer, providerId, selectedStrategyId } = this.props;
    const { refetchError } = this.state;

    return refetchError ? (
      <ErrorState title="Error fetching positions" description={refetchError.message} />
    ) : (
      <>
        <PositionList
          viewer={viewer}
          providerId={providerId}
          autoRefetch={false}
          selectedStrategyId={selectedStrategyId}
        />
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
    `,
  },
  graphql`
    query PositionAndOrderListRefetchQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...PositionList_viewer @arguments(providerId: $providerId, accountId: $accountId)
        ...OrderList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `,
);
