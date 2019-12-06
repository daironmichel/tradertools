/* tslint:disable */
/* @relayHash c761287d7daf9d9fc908adb5af39a5e3 */

import { ConcreteRequest } from "relay-runtime";
export type pages_indexQueryVariables = {};
export type pages_indexQueryResponse = {
    readonly viewer: {
        readonly brokers: ReadonlyArray<{
            readonly id: string;
            readonly databaseId: number;
            readonly name: string;
            readonly slug: string;
        }> | null;
    };
};
export type pages_indexQuery = {
    readonly response: pages_indexQueryResponse;
    readonly variables: pages_indexQueryVariables;
};



/*
query pages_indexQuery {
  viewer {
    brokers {
      id
      databaseId
      name
      slug
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
        "name": "brokers",
        "storageKey": null,
        "args": null,
        "concreteType": "BrokerNode",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "databaseId",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "pages_indexQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "pages_indexQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "pages_indexQuery",
    "id": null,
    "text": "query pages_indexQuery {\n  viewer {\n    brokers {\n      id\n      databaseId\n      name\n      slug\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'fb1e965f06b6d05cc3f79e721f45a0ff';
export default node;
