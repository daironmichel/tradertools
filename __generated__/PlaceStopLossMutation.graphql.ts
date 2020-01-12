/* tslint:disable */
/* @relayHash 6b9aa8579037d653061eb52fb6917ea2 */

import { ConcreteRequest } from "relay-runtime";
export type PlaceStopLossError = "ACCOUNT_NOT_PROVIDED" | "%future added value";
export type PlaceStopLossInput = {
    readonly providerId: string;
    readonly symbol: string;
    readonly accountId?: string | null;
    readonly clientMutationId?: string | null;
};
export type PlaceStopLossMutationVariables = {
    input: PlaceStopLossInput;
};
export type PlaceStopLossMutationResponse = {
    readonly placeStopLoss: {
        readonly error: PlaceStopLossError | null;
        readonly errorMessage: string | null;
    };
};
export type PlaceStopLossMutation = {
    readonly response: PlaceStopLossMutationResponse;
    readonly variables: PlaceStopLossMutationVariables;
};



/*
mutation PlaceStopLossMutation(
  $input: PlaceStopLossInput!
) {
  placeStopLoss(input: $input) {
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
    "type": "PlaceStopLossInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "placeStopLoss",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "PlaceStopLossPayload",
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
    "name": "PlaceStopLossMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PlaceStopLossMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "PlaceStopLossMutation",
    "id": null,
    "text": "mutation PlaceStopLossMutation(\n  $input: PlaceStopLossInput!\n) {\n  placeStopLoss(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '6106706d0f654dea666a3f6270997e98';
export default node;
