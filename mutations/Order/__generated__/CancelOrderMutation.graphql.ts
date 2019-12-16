/* tslint:disable */
/* @relayHash 06164ee95cbfbdc0c9c343e71b89a1bb */

import { ConcreteRequest } from "relay-runtime";
export type CancelOrderError = "ACCOUNT_NOT_PROVIDED" | "%future added value";
export type CancelOrderInput = {
    readonly providerId: string;
    readonly orderId: string;
    readonly accountId?: string | null;
    readonly clientMutationId?: string | null;
};
export type CancelOrderMutationVariables = {
    input: CancelOrderInput;
};
export type CancelOrderMutationResponse = {
    readonly cancelOrder: {
        readonly error: CancelOrderError | null;
        readonly errorMessage: string | null;
    };
};
export type CancelOrderMutation = {
    readonly response: CancelOrderMutationResponse;
    readonly variables: CancelOrderMutationVariables;
};



/*
mutation CancelOrderMutation(
  $input: CancelOrderInput!
) {
  cancelOrder(input: $input) {
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
    "type": "CancelOrderInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "cancelOrder",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CancelOrderPayload",
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
    "name": "CancelOrderMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "CancelOrderMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "CancelOrderMutation",
    "id": null,
    "text": "mutation CancelOrderMutation(\n  $input: CancelOrderInput!\n) {\n  cancelOrder(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b88e82070a3f389b47bf45b65a0c6844';
export default node;
