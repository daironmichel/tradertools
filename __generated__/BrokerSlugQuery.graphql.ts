/* tslint:disable */
/* @relayHash a18742a556fb9f21335f2f36dde91bd5 */

import { ConcreteRequest } from "relay-runtime";
export type BrokerSlugQueryVariables = {
    brokerSlug: string;
};
export type BrokerSlugQueryResponse = {
    readonly viewer: {
        readonly broker: {
            readonly id: string;
            readonly name: string;
            readonly slug: string;
            readonly serviceProviders: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly id: string;
                        readonly name: string;
                        readonly slug: string;
                    };
                }>;
            };
        } | null;
    };
};
export type BrokerSlugQuery = {
    readonly response: BrokerSlugQueryResponse;
    readonly variables: BrokerSlugQueryVariables;
};



/*
query BrokerSlugQuery(
  $brokerSlug: String!
) {
  viewer {
    broker(slug: $brokerSlug) {
      id
      name
      slug
      serviceProviders {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "brokerSlug",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = [
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
        "name": "broker",
        "storageKey": null,
        "args": [
          {
            "kind": "Variable",
            "name": "slug",
            "variableName": "brokerSlug"
          }
        ],
        "concreteType": "BrokerNode",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "serviceProviders",
            "storageKey": null,
            "args": null,
            "concreteType": "ServiceProviderConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ServiceProviderEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ServiceProviderNode",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/)
                    ]
                  }
                ]
              }
            ]
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
    "name": "BrokerSlugQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v4/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "BrokerSlugQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v4/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "BrokerSlugQuery",
    "id": null,
    "text": "query BrokerSlugQuery(\n  $brokerSlug: String!\n) {\n  viewer {\n    broker(slug: $brokerSlug) {\n      id\n      name\n      slug\n      serviceProviders {\n        edges {\n          node {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '986a3a5acc79453779f855f8c9fc980b';
export default node;
