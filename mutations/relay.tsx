import React from "react";
import { Box } from "rebass";
import { commitMutation, Environment, Disposable } from "react-relay";

import { createEnvironment } from "../relay";
import { MutationParameters, PayloadError, GraphQLTaggedNode } from "relay-runtime";
import toaster from "../components/toaster";

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
      const msg = (
        <Box>
          <h4>Operation failed for the following reasons:</h4>
          <ol>
            {errors.map((err, index) => {
              <li key={index}>
                {err.severity ? err.severity + ": " : ""}
                {err.message}
              </li>;
            })}
          </ol>
        </Box>
      );
      toaster.showError(msg);
    }

    for (let field in response) {
      if (!response.hasOwnProperty(field)) continue;
      if (response[field] && response[field].error) {
        console.error(response[field]);
        const msg = (
          <Box>
            <h4>Operation failed for the following reason:</h4>
            <p>
              {response[field].error}: {response[field].errorMessage}
            </p>
          </Box>
        );
        toaster.showError(msg);
      }
    }

    if (this.onCompleted) {
      this.onCompleted(response, errors);
    }
  };

  defaultOnError = (error: Error) => {
    console.error(error);
    const msg = (
      <Box>
        <h4>Operation failed for the following reason:</h4>
        <p>
          {error.name}: {error.message}
        </p>
      </Box>
    );
    toaster.showError(msg);

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
