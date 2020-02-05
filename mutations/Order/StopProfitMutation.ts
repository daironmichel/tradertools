import { graphql } from 'react-relay';
import { Mutation } from '../relay';
import { StopProfitMutation as StopProfitMutationType } from 'gen/StopProfitMutation.graphql';

export default class StopProfitMutation extends Mutation<StopProfitMutationType> {
  mutation = graphql`
    mutation StopProfitMutation($input: StopProfitInput!) {
      stopProfit(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
