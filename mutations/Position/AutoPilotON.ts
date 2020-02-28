import { graphql } from 'react-relay';
import { Mutation } from '../relay';
import { AutoPilotONMutation as AutoPilotONMutationType } from 'gen/AutoPilotONMutation.graphql';

export default class AutoPilotONMutation extends Mutation<AutoPilotONMutationType> {
  mutation = graphql`
    mutation AutoPilotONMutation($input: AutoPilotONInput!) {
      autoPilotOn(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
