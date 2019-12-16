/* tslint:disable */
/* @relayHash 525a9d72d32e6c49884ac54a7f35aa17 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionAndOrderListRefetchQueryVariables = {
    providerId: string;
    accountId?: string | null;
};
export type PositionAndOrderListRefetchQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"PositionList_viewer" | "OrderList_viewer">;
    };
};
export type PositionAndOrderListRefetchQuery = {
    readonly response: PositionAndOrderListRefetchQueryResponse;
    readonly variables: PositionAndOrderListRefetchQueryVariables;
};



/*
query PositionAndOrderListRefetchQuery(
  $providerId: ID!
  $accountId: ID
) {
  viewer {
    ...PositionList_viewer_15bWwS
    ...OrderList_viewer_15bWwS
  }
}

fragment OrderListItem_order on OrderType {
  orderId
  symbol
  quantity
  limitPrice
  status
}

fragment OrderList_viewer_15bWwS on ViewerType {
  orders(providerId: $providerId, accountId: $accountId) {
    ...OrderListItem_order
  }
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
    "name": "PositionAndOrderListRefetchQuery",
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
            "name": "PositionList_viewer",
            "args": (v1/*: any*/)
          },
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
    "name": "PositionAndOrderListRefetchQuery",
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
                "name": "status",
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
    "name": "PositionAndOrderListRefetchQuery",
    "id": null,
    "text": "query PositionAndOrderListRefetchQuery(\n  $providerId: ID!\n  $accountId: ID\n) {\n  viewer {\n    ...PositionList_viewer_15bWwS\n    ...OrderList_viewer_15bWwS\n  }\n}\n\nfragment OrderListItem_order on OrderType {\n  orderId\n  symbol\n  quantity\n  limitPrice\n  status\n}\n\nfragment OrderList_viewer_15bWwS on ViewerType {\n  orders(providerId: $providerId, accountId: $accountId) {\n    ...OrderListItem_order\n  }\n}\n\nfragment PositionListItem_position on PositionType {\n  symbol\n  quantity\n  pricePaid\n  totalGain\n}\n\nfragment PositionList_viewer_15bWwS on ViewerType {\n  positions(providerId: $providerId, accountId: $accountId) {\n    ...PositionListItem_position\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '7b7339ed0dd8ce35bbb11823ba3d5abd';
export default node;
