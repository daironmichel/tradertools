import { graphql, commitMutation, Environment, Disposable } from "react-relay";
import { createEnvironment } from "../../relay";
import { ConnectProviderInput, ConnectProviderMutationResponse } from "./__generated__/ConnectProviderMutation.graphql";

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
  onCompleted?: (response: ConnectProviderMutationResponse | null, errors: Array<Error> | null) => void,
  onError?: (error: Error) => void,
  environment?: Environment
): Disposable {
  // Now we just call commitMutation with the appropriate parameters
  return commitMutation(environment || createEnvironment(), {
    mutation,
    variables: { input },
    onCompleted,
    onError
  });
}

export default { commit };
