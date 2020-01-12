import { graphql } from 'react-relay';
import { Mutation } from '../relay';
import { PlaceStopLossMutation as PlaceStopLossMutationType } from 'gen/PlaceStopLossMutation.graphql';

export default class PlaceStopLossMutation extends Mutation<PlaceStopLossMutationType> {
  mutation = graphql`
    mutation PlaceStopLossMutation($input: PlaceStopLossInput!) {
      placeStopLoss(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
