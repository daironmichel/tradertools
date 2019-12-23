/* tslint:disable */
/* @relayHash f040d48d1294694b9c6852415516a2da */

import { ConcreteRequest } from "relay-runtime";
export type settingsQueryVariables = {};
export type settingsQueryResponse = {
    readonly viewer: {
        readonly settings: {
            readonly refreshRate: number;
        } | null;
    };
};
export type settingsQuery = {
    readonly response: settingsQueryResponse;
    readonly variables: settingsQueryVariables;
};



/*
query settingsQuery {
  viewer {
    settings {
      refreshRate
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "refreshRate",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "settingsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "SettingsNode",
            "plural": false,
            "selections": [
              (v0/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "settingsQuery",
    "argumentDefinitions": [],
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
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "SettingsNode",
            "plural": false,
            "selections": [
              (v0/*: any*/),
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
  },
  "params": {
    "operationKind": "query",
    "name": "settingsQuery",
    "id": null,
    "text": "query settingsQuery {\n  viewer {\n    settings {\n      refreshRate\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '64863f309f0eb61fc2e3728a42dd3285';
export default node;
