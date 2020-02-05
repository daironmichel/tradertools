import { graphql } from 'react-relay';
import { Mutation } from '../relay';
import { StopLossMutation as StopLossMutationType } from 'gen/StopLossMutation.graphql';

export default class StopLossMutation extends Mutation<StopLossMutationType> {
  mutation = graphql`
    mutation StopLossMutation($input: StopLossInput!) {
      stopLoss(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
