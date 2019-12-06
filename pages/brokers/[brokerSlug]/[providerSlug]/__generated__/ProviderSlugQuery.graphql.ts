/* tslint:disable */
/* @relayHash 9cf821ea0c6bc8cbcf91c2ecbddad11b */

import { ConcreteRequest } from "relay-runtime";
export type SessionStatus = "CLOSED" | "CONNECTED" | "EXPIRED" | "INACTIVE" | "REQUESTING" | "%future added value";
export type ProviderSlugQueryVariables = {
    brokerSlug: string;
    providerSlug: string;
};
export type ProviderSlugQueryResponse = {
    readonly viewer: {
        readonly broker: {
            readonly id: string;
            readonly databaseId: number;
            readonly name: string;
            readonly serviceProvider: {
                readonly id: string;
                readonly databaseId: number;
                readonly name: string;
                readonly slug: string;
                readonly session: {
                    readonly id: string;
                    readonly databaseId: number;
                    readonly status: SessionStatus | null;
                } | null;
            } | null;
        } | null;
    };
};
export type ProviderSlugQuery = {
    readonly response: ProviderSlugQueryResponse;
    readonly variables: ProviderSlugQueryVariables;
};



/*
query ProviderSlugQuery(
  $brokerSlug: String!
  $providerSlug: String!
) {
  viewer {
    broker(slug: $brokerSlug) {
      id
      databaseId
      name
      serviceProvider(slug: $providerSlug) {
        id
        databaseId
        name
        slug
        session {
          id
          databaseId
          status
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
  },
  {
    "kind": "LocalArgument",
    "name": "providerSlug",
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
  "name": "databaseId",
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
            "name": "serviceProvider",
            "storageKey": null,
            "args": [
              {
                "kind": "Variable",
                "name": "slug",
                "variableName": "providerSlug"
              }
            ],
            "concreteType": "ServiceProviderNode",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "slug",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "session",
                "storageKey": null,
                "args": null,
                "concreteType": "ProviderSessionNode",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "status",
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
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ProviderSlugQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v4/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ProviderSlugQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v4/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "ProviderSlugQuery",
    "id": null,
    "text": "query ProviderSlugQuery(\n  $brokerSlug: String!\n  $providerSlug: String!\n) {\n  viewer {\n    broker(slug: $brokerSlug) {\n      id\n      databaseId\n      name\n      serviceProvider(slug: $providerSlug) {\n        id\n        databaseId\n        name\n        slug\n        session {\n          id\n          databaseId\n          status\n        }\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '37ddc34c80a9c125b9c4b4d216e1582d';
export default node;
