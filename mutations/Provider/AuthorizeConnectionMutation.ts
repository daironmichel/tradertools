import { graphql } from 'react-relay';
import { AuthorizeConnectionMutation as AuthorizeConnectionMutationType } from '../../__generated__/AuthorizeConnectionMutation.graphql';
import { Mutation } from '../relay';

export default class AuthorizeConnectionMutation extends Mutation<AuthorizeConnectionMutationType> {
  mutation = graphql`
    mutation AuthorizeConnectionMutation($input: AuthorizeConnectionInput!) {
      authorizeConnection(input: $input) {
        error
        errorMessage

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
          broker {
            slug
          }
        }
      }
    }
  `;
}
