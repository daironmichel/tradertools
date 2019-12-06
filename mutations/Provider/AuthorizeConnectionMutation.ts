import { graphql, commitMutation, Environment, Disposable } from "react-relay";
import { createEnvironment } from "../../relay";
import {
  AuthorizeConnectionInput,
  AuthorizeConnectionMutationResponse,
  AuthorizeConnectionMutation
} from "./__generated__/AuthorizeConnectionMutation.graphql";
import { PayloadError } from "relay-runtime";

const mutation = graphql`
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

function commit(
  input: AuthorizeConnectionInput,
  onCompleted?: (response: AuthorizeConnectionMutationResponse, errors?: ReadonlyArray<PayloadError> | null) => void,
  onError?: (error: Error) => void,
  environment?: Environment
): Disposable {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation<AuthorizeConnectionMutation>(environment || createEnvironment(), {
    mutation,
    variables: { input },
    onCompleted,
    onError
  });
}

export default { commit };
