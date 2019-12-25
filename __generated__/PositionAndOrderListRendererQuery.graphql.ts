/* tslint:disable */
/* @relayHash cd12eb53033a55cebbd6cf29c9d2d866 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionAndOrderListRendererQueryVariables = {
    providerId: string;
    accountId?: string | null;
};
export type PositionAndOrderListRendererQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"PositionAndOrderList_viewer">;
    };
};
export type PositionAndOrderListRendererQuery = {
    readonly response: PositionAndOrderListRendererQueryResponse;
    readonly variables: PositionAndOrderListRendererQueryVariables;
};



/*
query PositionAndOrderListRendererQuery(
  $providerId: ID!
  $accountId: ID
) {
  viewer {
    ...PositionAndOrderList_viewer_15bWwS
  }
}

fragment OrderListItem_order on OrderType {
  orderId
  symbol
  quantity
  limitPrice
  executionPrice
  status
  action
}

fragment OrderList_viewer_15bWwS on ViewerType {
  orders(providerId: $providerId, accountId: $accountId) {
    ...OrderListItem_order
  }
}

fragment PositionAndOrderList_viewer_15bWwS on ViewerType {
  ...PositionList_viewer_15bWwS
  ...OrderList_viewer_15bWwS
}

fragment PositionListItem_position on PositionType {
  symbol
  quantity
  pricePaid
  totalGain
}

fragment PositionList_viewer_15bWwS on ViewerType {
  positions(providerId: $providerId, accountId: $accountId) {
    ...PositionListItem_position
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
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "symbol",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "quantity",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PositionAndOrderListRendererQuery",
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
            "name": "PositionAndOrderList_viewer",
            "args": (v1/*: any*/)
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PositionAndOrderListRendererQuery",
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
            "name": "positions",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "PositionType",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "pricePaid",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "totalGain",
                "args": null,
                "storageKey": null
              }
            ]
          },
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
              (v2/*: any*/),
              (v3/*: any*/),
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
    "name": "PositionAndOrderListRendererQuery",
    "id": null,
    "text": "query PositionAndOrderListRendererQuery(\n  $providerId: ID!\n  $accountId: ID\n) {\n  viewer {\n    ...PositionAndOrderList_viewer_15bWwS\n  }\n}\n\nfragment OrderListItem_order on OrderType {\n  orderId\n  symbol\n  quantity\n  limitPrice\n  executionPrice\n  status\n  action\n}\n\nfragment OrderList_viewer_15bWwS on ViewerType {\n  orders(providerId: $providerId, accountId: $accountId) {\n    ...OrderListItem_order\n  }\n}\n\nfragment PositionAndOrderList_viewer_15bWwS on ViewerType {\n  ...PositionList_viewer_15bWwS\n  ...OrderList_viewer_15bWwS\n}\n\nfragment PositionListItem_position on PositionType {\n  symbol\n  quantity\n  pricePaid\n  totalGain\n}\n\nfragment PositionList_viewer_15bWwS on ViewerType {\n  positions(providerId: $providerId, accountId: $accountId) {\n    ...PositionListItem_position\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '35625d7ff3c37a7492e590c5c5d7274e';
export default node;
