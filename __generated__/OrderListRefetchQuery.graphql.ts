/* tslint:disable */
/* @relayHash 8e0fe9d224dbb69300878046ae9a50e0 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderListRefetchQueryVariables = {
    providerId: string;
    accountId?: string | null;
};
export type OrderListRefetchQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"OrderList_viewer">;
    };
};
export type OrderListRefetchQuery = {
    readonly response: OrderListRefetchQueryResponse;
    readonly variables: OrderListRefetchQueryVariables;
};



/*
query OrderListRefetchQuery(
  $providerId: ID!
  $accountId: ID
) {
  viewer {
    ...OrderList_viewer_15bWwS
  }
}

fragment OrderListItem_order on OrderType {
  orderId
  symbol
  quantity
  limitPrice
  stopPrice
  stopLimitPrice
  executionPrice
  status
  action
}

fragment OrderList_viewer_15bWwS on ViewerType {
  orders(providerId: $providerId, accountId: $accountId) {
    ...OrderListItem_order
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "providerId",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "accountId",
    "type": "ID",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "accountId",
    "variableName": "accountId"
  },
  {
    "kind": "Variable",
    "name": "providerId",
    "variableName": "providerId"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "OrderListRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "ViewerType",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "OrderList_viewer",
            "args": (v1/*: any*/)
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "OrderListRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "ViewerType",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "orders",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "OrderType",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "orderId",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "symbol",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "quantity",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "limitPrice",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "stopPrice",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "stopLimitPrice",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "executionPrice",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "status",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "action",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "OrderListRefetchQuery",
    "id": null,
    "text": "query OrderListRefetchQuery(\n  $providerId: ID!\n  $accountId: ID\n) {\n  viewer {\n    ...OrderList_viewer_15bWwS\n  }\n}\n\nfragment OrderListItem_order on OrderType {\n  orderId\n  symbol\n  quantity\n  limitPrice\n  stopPrice\n  stopLimitPrice\n  executionPrice\n  status\n  action\n}\n\nfragment OrderList_viewer_15bWwS on ViewerType {\n  orders(providerId: $providerId, accountId: $accountId) {\n    ...OrderListItem_order\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '3012fe98e34c0b7b358fa883831f8895';
export default node;
