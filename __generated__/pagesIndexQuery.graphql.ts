/* tslint:disable */
/* @relayHash f13145df32c3508f3089aae9c35498ca */

import { ConcreteRequest } from "relay-runtime";
export type pagesIndexQueryVariables = {};
export type pagesIndexQueryResponse = {
    readonly viewer: {
        readonly settings: {
            readonly defaultBroker: {
                readonly slug: string;
                readonly defaultProvider: {
                    readonly slug: string;
                } | null;
            } | null;
        } | null;
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
    settings {
      defaultBroker {
        slug
        defaultProvider {
          slug
          id
        }
        id
      }
      id
    }
    brokers {
      id
      name
      slug
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "brokers",
  "storageKey": null,
  "args": null,
  "concreteType": "BrokerNode",
  "plural": true,
  "selections": [
    (v1/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/)
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "pagesIndexQuery",
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "defaultBroker",
                "storageKey": null,
                "args": null,
                "concreteType": "BrokerNode",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "defaultProvider",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ServiceProviderNode",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "pagesIndexQuery",
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "defaultBroker",
                "storageKey": null,
                "args": null,
                "concreteType": "BrokerNode",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "defaultProvider",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ServiceProviderNode",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v1/*: any*/)
                    ]
                  },
                  (v1/*: any*/)
                ]
              },
              (v1/*: any*/)
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "pagesIndexQuery",
    "id": null,
    "text": "query pagesIndexQuery {\n  viewer {\n    settings {\n      defaultBroker {\n        slug\n        defaultProvider {\n          slug\n          id\n        }\n        id\n      }\n      id\n    }\n    brokers {\n      id\n      name\n      slug\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '3cef415b3fc1aede72fa0423c35f8a5e';
export default node;
