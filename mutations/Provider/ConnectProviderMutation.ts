import { graphql, commitMutation, Environment, Disposable } from "react-relay";
import { createEnvironment } from "../../relay";
import {
  ConnectProviderInput,
  ConnectProviderMutationResponse,
  ConnectProviderMutation
} from "./__generated__/ConnectProviderMutation.graphql";
import { PayloadError } from "relay-runtime";

const mutation = graphql`
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

function commit(
  input: ConnectProviderInput,
  onCompleted?: (response: ConnectProviderMutationResponse, errors?: ReadonlyArray<PayloadError> | null) => void,
  onError?: (error: Error) => void,
  environment?: Environment
): Disposable {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation<ConnectProviderMutation>(environment || createEnvironment(), {
    mutation,
    variables: { input },
    onCompleted,
    onError
  });
}

export default { commit };
