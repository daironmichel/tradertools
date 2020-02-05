/* tslint:disable */
/* @relayHash 256a6fe4e05b92e5fbd9e86920ef538d */

import { ConcreteRequest } from "relay-runtime";
export type StopProfitError = "ACCOUNT_NOT_PROVIDED" | "NOT_ALLOWED_ON_AUTOPILOT" | "STRATEGY_NOT_FOUND" | "%future added value";
export type StopProfitInput = {
    readonly providerId: string;
    readonly symbol: string;
    readonly strategyId?: string | null;
    readonly accountId?: string | null;
    readonly clientMutationId?: string | null;
};
export type StopProfitMutationVariables = {
    input: StopProfitInput;
};
export type StopProfitMutationResponse = {
    readonly stopProfit: {
        readonly error: StopProfitError | null;
        readonly errorMessage: string | null;
    };
};
export type StopProfitMutation = {
    readonly response: StopProfitMutationResponse;
    readonly variables: StopProfitMutationVariables;
};



/*
mutation StopProfitMutation(
  $input: StopProfitInput!
) {
  stopProfit(input: $input) {
    error
    errorMessage
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "StopProfitInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "stopProfit",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "StopProfitPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "error",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "errorMessage",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "StopProfitMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "StopProfitMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "StopProfitMutation",
    "id": null,
    "text": "mutation StopProfitMutation(\n  $input: StopProfitInput!\n) {\n  stopProfit(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '5a363fa03dc60bb563e244b2cb5c9d7f';
export default node;
