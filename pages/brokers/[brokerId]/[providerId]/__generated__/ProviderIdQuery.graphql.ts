/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type SessionStatus = "CLOSED" | "CONNECTED" | "EXPIRED" | "INACTIVE" | "REQUESTING" | "%future added value";
export type ProviderIdQueryVariables = {
    nodeId: string;
};
export type ProviderIdQueryResponse = {
    readonly node: {
        readonly id?: string;
        readonly name?: string;
        readonly session?: {
            readonly id: string;
            readonly status: SessionStatus | null;
        } | null;
    } | null;
};
export type ProviderIdQuery = {
    readonly response: ProviderIdQueryResponse;
    readonly variables: ProviderIdQueryVariables;
};



/*
query ProviderIdQuery(
  $nodeId: ID!
) {
  node(id: $nodeId) {
    __typename
    ... on ServiceProviderNode {
      id
      name
      session {
        id
        status
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "nodeId",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "nodeId"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "session",
  "storageKey": null,
  "args": null,
  "concreteType": "ProviderSessionNode",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ProviderIdQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "ServiceProviderNode",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ProviderIdQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "ServiceProviderNode",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ProviderIdQuery",
    "id": null,
    "text": "query ProviderIdQuery(\n  $nodeId: ID!\n) {\n  node(id: $nodeId) {\n    __typename\n    ... on ServiceProviderNode {\n      id\n      name\n      session {\n        id\n        status\n      }\n    }\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'ae8ee65fe20a44fc44568670ff0b4c2f';
export default node;
