/* tslint:disable */
/* @relayHash e74278057fad871f2dfd2b8e3c1513d8 */

import { ConcreteRequest } from "relay-runtime";
export type StopLossError = "ACCOUNT_NOT_PROVIDED" | "NOT_ALLOWED_ON_AUTOPILOT" | "%future added value";
export type StopLossInput = {
    readonly providerId: string;
    readonly symbol: string;
    readonly accountId?: string | null;
    readonly clientMutationId?: string | null;
};
export type StopLossMutationVariables = {
    input: StopLossInput;
};
export type StopLossMutationResponse = {
    readonly stopLoss: {
        readonly error: StopLossError | null;
        readonly errorMessage: string | null;
    };
};
export type StopLossMutation = {
    readonly response: StopLossMutationResponse;
    readonly variables: StopLossMutationVariables;
};



/*
mutation StopLossMutation(
  $input: StopLossInput!
) {
  stopLoss(input: $input) {
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
    "type": "StopLossInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "stopLoss",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "StopLossPayload",
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
    "name": "StopLossMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "StopLossMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "StopLossMutation",
    "id": null,
    "text": "mutation StopLossMutation(\n  $input: StopLossInput!\n) {\n  stopLoss(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '981c51004ce54b00ed8945e33c792ff3';
export default node;
