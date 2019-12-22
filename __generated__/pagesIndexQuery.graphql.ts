/* tslint:disable */
/* @relayHash d1435a363360f6f7360b5ff409697c84 */

import { ConcreteRequest } from "relay-runtime";
export type pagesIndexQueryVariables = {};
export type pagesIndexQueryResponse = {
    readonly viewer: {
        readonly brokers: ReadonlyArray<{
            readonly id: string;
            readonly name: string;
            readonly slug: string;
        }>;
    };
};
export type pagesIndexQuery = {
    readonly response: pagesIndexQueryResponse;
    readonly variables: pagesIndexQueryVariables;
};



/*
query pagesIndexQuery {
  viewer {
    brokers {
      id
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
    "name": "pagesIndexQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "pagesIndexQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "pagesIndexQuery",
    "id": null,
    "text": "query pagesIndexQuery {\n  viewer {\n    brokers {\n      id\n      name\n      slug\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b55f65fae6e39864a3f001018377ab39';
export default node;
