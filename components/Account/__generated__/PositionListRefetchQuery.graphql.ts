/* tslint:disable */
/* @relayHash 24afa87ec3ad3094d8cc6dd85607ced1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionListRefetchQueryVariables = {
    providerId: string;
    accountId?: string | null;
};
export type PositionListRefetchQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"PositionList_viewer">;
    };
};
export type PositionListRefetchQuery = {
    readonly response: PositionListRefetchQueryResponse;
    readonly variables: PositionListRefetchQueryVariables;
};



/*
query PositionListRefetchQuery(
  $providerId: ID!
  $accountId: ID
) {
  viewer {
    ...PositionList_viewer_15bWwS
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PositionListRefetchQuery",
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
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PositionListRefetchQuery",
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
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PositionListRefetchQuery",
    "id": null,
    "text": "query PositionListRefetchQuery(\n  $providerId: ID!\n  $accountId: ID\n) {\n  viewer {\n    ...PositionList_viewer_15bWwS\n  }\n}\n\nfragment PositionListItem_position on PositionType {\n  symbol\n  quantity\n  pricePaid\n  totalGain\n}\n\nfragment PositionList_viewer_15bWwS on ViewerType {\n  positions(providerId: $providerId, accountId: $accountId) {\n    ...PositionListItem_position\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '8f52e38b1d173f21d381d8213a43d78a';
export default node;
