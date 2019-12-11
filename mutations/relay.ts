import { commitMutation, Environment, Disposable } from "react-relay";

import { createEnvironment } from "../relay";
import { MutationParameters, PayloadError, GraphQLTaggedNode } from "relay-runtime";

interface CommitMutationParameters extends MutationParameters {
  readonly variables: { readonly input: {} };
  readonly response: { readonly [field: string]: { error?: string | null; errorMessage?: string | null } };
}

export type MutationOnCompleteHandler<TMutation extends CommitMutationParameters = CommitMutationParameters> = (
  response: TMutation["response"],
  errors?: ReadonlyArray<PayloadError> | null
) => void;
export type MutationOnErrorHandler = (error: Error) => void;

export class Mutation<TMutation extends CommitMutationParameters = CommitMutationParameters> {
  mutation?: GraphQLTaggedNode;
  onCompleted?: MutationOnCompleteHandler<TMutation>;
  onError?: MutationOnErrorHandler;

  // constructor(mutation: GraphQLTaggedNode) {
  //   this.mutation = mutation;
  // }

  commit = (
    input: TMutation["variables"]["input"],
    onCompleted?: MutationOnCompleteHandler<TMutation>,
    onError?: MutationOnErrorHandler,
    environment?: Environment
  ): Disposable => {
    if (!this.mutation) {
      throw new Error(`property "mutation" is not defiend in ${typeof this}`);
    }
    this.onCompleted = onCompleted;
    this.onError = onError;
    // Now we just call commitMutation with the appropriate parameters
    return commitMutation<TMutation>(environment || createEnvironment(), {
      mutation: this.mutation,
      variables: { input },
      onCompleted: this.defaultOnCompleted,
      onError: this.defaultOnError
    });
  };

  defaultOnCompleted = (response: TMutation["response"], errors?: ReadonlyArray<PayloadError> | null) => {
    if (errors) {
      console.error(errors);
    }

    for (let field in response) {
      if (!response.hasOwnProperty(field)) continue;
      if (response[field] && response[field].error) {
        console.error(response[field]);
      }
    }

    if (this.onCompleted) {
      this.onCompleted(response, errors);
    }
  };

  defaultOnError = (error: Error) => {
    console.error(error);
    if (this.onError) {
      this.onError(error);
    }
  };
}

// export function commit<TMutation extends CommitMutationParameters = CommitMutationParameters>(
//   input: TMutation["variables"]["input"],
//   mutation: GraphQLTaggedNode,
//   onCompleted?: (response: TMutation["response"], errors?: ReadonlyArray<PayloadError> | null) => void,
//   onError?: (error: Error) => void,
//   environment?: Environment
// ): Disposable {
//   // Now we just call commitMutation with the appropriate parameters
//   return commitMutation<TMutation>(environment || createEnvironment(), {
//     mutation,
//     variables: { input },
//     onCompleted,
//     onError
//   });
// }
