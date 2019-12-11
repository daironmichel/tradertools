/* tslint:disable */
/* @relayHash 6e842420cf5742a7b1ad767ab63445c6 */

import { ConcreteRequest } from "relay-runtime";
export type BuyStockError = "INVALID" | "%future added value";
export type BuyStockInput = {
    readonly providerId: string;
    readonly accountId: string;
    readonly strategyId: string;
    readonly symbol: string;
    readonly clientMutationId?: string | null;
};
export type BuyStockMutationVariables = {
    input: BuyStockInput;
};
export type BuyStockMutationResponse = {
    readonly buyStock: {
        readonly error: BuyStockError | null;
        readonly errorMessage: string | null;
    };
};
export type BuyStockMutation = {
    readonly response: BuyStockMutationResponse;
    readonly variables: BuyStockMutationVariables;
};



/*
mutation BuyStockMutation(
  $input: BuyStockInput!
) {
  buyStock(input: $input) {
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
    "type": "BuyStockInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "buyStock",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "BuyStockPayload",
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
    "name": "BuyStockMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "BuyStockMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "BuyStockMutation",
    "id": null,
    "text": "mutation BuyStockMutation(\n  $input: BuyStockInput!\n) {\n  buyStock(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'cef260c393938e8ca34577cba0783478';
export default node;
