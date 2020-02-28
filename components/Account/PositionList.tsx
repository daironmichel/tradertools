/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react';
import { Callout } from '@blueprintjs/core';
import { Flex, Box } from 'rebass';
import { createRefetchContainer, graphql, RelayRefetchProp } from 'react-relay';
import { PositionList_viewer } from '../../__generated__/PositionList_viewer.graphql';
import PositionListItem from './PositionListItem';
import ErrorState from '../generic/ErrorState';
import { IconNames } from '@blueprintjs/icons';

interface Props {
  relay: RelayRefetchProp;
  viewer: PositionList_viewer;
  providerId: string;
  selectedStrategyId?: number;
  autoRefetch?: boolean;
}

interface State {
  refetchError: Error | null;
}

class PositionList extends Component<Props, State> {
  static defaultProps = {
    autoRefetch: true,
  };

  timeoutId: number | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      refetchError: null,
    };
  }

  componentDidMount(): void {
    if (this.props.autoRefetch) {
      this.timeoutId = setInterval(this.refresh, 2000);
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

    return (
      <Flex flexDirection="column" width={[1]}>
        <Flex justifyContent="space-between" alignItems="center">
          <h3>Positions</h3>
        </Flex>
        {refetchError ? (
          <ErrorState title="Error fetching positions" description={refetchError.message} />
        ) : (
          <Box css={{ '> div': { marginBottom: 4 } }}>
            {viewer.positions.length > 0 ? (
              viewer.positions.map((position, idx) => (
                <PositionListItem
                  key={idx}
                  position={position}
                  providerId={providerId}
                  selectedStrategyId={selectedStrategyId}
                />
              ))
            ) : (
              <Callout icon={IconNames.INBOX}>No positions to show at this moment...</Callout>
            )}
          </Box>
        )}
      </Flex>
    );
  }
}

export default createRefetchContainer(
  PositionList,
  {
    viewer: graphql`
      fragment PositionList_viewer on ViewerType
        @argumentDefinitions(providerId: { type: "ID!" }, accountId: { type: "ID" }) {
        positions(providerId: $providerId, accountId: $accountId) {
          ...PositionListItem_position
        }
      }
    `,
  },
  graphql`
    query PositionListRefetchQuery($providerId: ID!, $accountId: ID) {
      viewer {
        ...PositionList_viewer @arguments(providerId: $providerId, accountId: $accountId)
      }
    }
  `,
);
