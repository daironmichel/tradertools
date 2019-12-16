/* tslint:disable */
/* @relayHash 6116859ce076c6b467515a0dab4a8d6d */

import { ConcreteRequest } from "relay-runtime";
export type SellStockError = "ACCOUNT_NOT_PROVIDED" | "%future added value";
export type SellStockInput = {
    readonly providerId: string;
    readonly symbol: string;
    readonly accountId?: string | null;
    readonly clientMutationId?: string | null;
};
export type SellStockMutationVariables = {
    input: SellStockInput;
};
export type SellStockMutationResponse = {
    readonly sellStock: {
        readonly error: SellStockError | null;
        readonly errorMessage: string | null;
    };
};
export type SellStockMutation = {
    readonly response: SellStockMutationResponse;
    readonly variables: SellStockMutationVariables;
};



/*
mutation SellStockMutation(
  $input: SellStockInput!
) {
  sellStock(input: $input) {
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
    "type": "SellStockInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "sellStock",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SellStockPayload",
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
    "name": "SellStockMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SellStockMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SellStockMutation",
    "id": null,
    "text": "mutation SellStockMutation(\n  $input: SellStockInput!\n) {\n  sellStock(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'aa280fcc041d68f4ace8f4e5a7c15d54';
export default node;
