/* tslint:disable */
/* @relayHash 74caf55e42482d419eb1c42c700c2e55 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionListRendererQueryVariables = {
    providerId: string;
    accountId?: string | null;
};
export type PositionListRendererQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"PositionList_viewer">;
    };
};
export type PositionListRendererQuery = {
    readonly response: PositionListRendererQueryResponse;
    readonly variables: PositionListRendererQueryVariables;
};



/*
query PositionListRendererQuery(
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
  totalGainPct
  autopilot {
    status
    state
    errorMessage
    id
  }
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
    "name": "PositionListRendererQuery",
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
    "name": "PositionListRendererQuery",
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "totalGainPct",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "autopilot",
                "storageKey": null,
                "args": null,
                "concreteType": "AutoPilotTaskNode",
                "plural": false,
                "selections": [
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
                    "name": "state",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "errorMessage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PositionListRendererQuery",
    "id": null,
    "text": "query PositionListRendererQuery(\n  $providerId: ID!\n  $accountId: ID\n) {\n  viewer {\n    ...PositionList_viewer_15bWwS\n  }\n}\n\nfragment PositionListItem_position on PositionType {\n  symbol\n  quantity\n  pricePaid\n  totalGain\n  totalGainPct\n  autopilot {\n    status\n    state\n    errorMessage\n    id\n  }\n}\n\nfragment PositionList_viewer_15bWwS on ViewerType {\n  positions(providerId: $providerId, accountId: $accountId) {\n    ...PositionListItem_position\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '12bd0f924c2d7c2c0090c962ce5cb51b';
export default node;
