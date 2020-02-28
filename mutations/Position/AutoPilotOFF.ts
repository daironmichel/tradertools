import { graphql } from 'react-relay';
import { Mutation } from '../relay';
import { AutoPilotOFFMutation as AutoPilotOFFMutationType } from 'gen/AutoPilotOFFMutation.graphql';

export default class AutoPilotOFFMutation extends Mutation<AutoPilotOFFMutationType> {
  mutation = graphql`
    mutation AutoPilotOFFMutation($input: AutoPilotOFFInput!) {
      autoPilotOff(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
