import { graphql } from 'react-relay';
import { ConnectProviderMutation as ConnectProviderMutationType } from '../../__generated__/ConnectProviderMutation.graphql';
import { Mutation } from '../relay';

export default class ConnectProviderMutation extends Mutation<ConnectProviderMutationType> {
  mutation = graphql`
    mutation ConnectProviderMutation($input: ConnectProviderInput!) {
      connectProvider(input: $input) {
        error
        errorMessage

        authorizeUrl
        callbackEnabled
        serviceProvider {
          id
          databaseId
          name
          slug
          session {
            id
            databaseId
            status
          }
        }
      }
    }
  `;
}
