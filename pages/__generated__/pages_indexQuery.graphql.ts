/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type pages_indexQueryVariables = {};
export type pages_indexQueryResponse = {
    readonly viewer: {
        readonly credentials: {
            readonly databaseId: number | null;
            readonly fullName: string | null;
        } | null;
    } | null;
};
export type pages_indexQuery = {
    readonly response: pages_indexQueryResponse;
    readonly variables: pages_indexQueryVariables;
};



/*
query pages_indexQuery {
  viewer {
    credentials {
      databaseId
      fullName
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
        "name": "credentials",
        "storageKey": null,
        "args": null,
        "concreteType": "ViewerCredentialsType",
        "plural": false,
        "selections": [
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
            "name": "fullName",
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
    "text": "query pages_indexQuery {\n  viewer {\n    credentials {\n      databaseId\n      fullName\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'af4d570a6203dc4b3e94b6c53de0d7a1';
export default node;
