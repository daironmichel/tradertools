/* tslint:disable */
/* @relayHash 17bb3cb2b21fa0f24a1ea3c5ef9f342b */

import { ConcreteRequest } from "relay-runtime";
export type MainNavbarUserOptionsQueryVariables = {};
export type MainNavbarUserOptionsQueryResponse = {
    readonly viewer: {
        readonly credentials: {
            readonly fullName: string;
        };
    };
};
export type MainNavbarUserOptionsQuery = {
    readonly response: MainNavbarUserOptionsQueryResponse;
    readonly variables: MainNavbarUserOptionsQueryVariables;
};



/*
query MainNavbarUserOptionsQuery {
  viewer {
    credentials {
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
    "name": "MainNavbarUserOptionsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "MainNavbarUserOptionsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "MainNavbarUserOptionsQuery",
    "id": null,
    "text": "query MainNavbarUserOptionsQuery {\n  viewer {\n    credentials {\n      fullName\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '7e2bfbd3907abace46dc91ae6d8ec22d';
export default node;
