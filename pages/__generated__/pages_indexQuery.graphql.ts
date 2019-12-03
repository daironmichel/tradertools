/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ServiceProviderProtocol = "OAUTH1" | "OAUTH2" | "%future added value";
export type SessionStatus = "CLOSED" | "CONNECTED" | "EXPIRED" | "INACTIVE" | "REQUESTING" | "%future added value";
export type pages_indexQueryVariables = {};
export type pages_indexQueryResponse = {
    readonly viewer: {
        readonly brokers: ReadonlyArray<{
            readonly id: string;
            readonly databaseId: number | null;
            readonly name: string;
            readonly serviceProviders: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly id: string;
                        readonly databaseId: number | null;
                        readonly name: string;
                        readonly protocol: ServiceProviderProtocol;
                        readonly session: {
                            readonly status: SessionStatus | null;
                        } | null;
                    } | null;
                } | null>;
            };
        } | null> | null;
    } | null;
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
      serviceProviders {
        edges {
          node {
            id
            databaseId
            name
            protocol
            session {
              status
              id
            }
          }
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "databaseId",
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
  "name": "protocol",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "pages_indexQuery",
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
            "name": "brokers",
            "storageKey": null,
            "args": null,
            "concreteType": "BrokerNode",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "serviceProviders",
                "storageKey": null,
                "args": null,
                "concreteType": "ServiceProviderNodeConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ServiceProviderNodeEdge",
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
                          (v0/*: any*/),
                          (v1/*: any*/),
                          (v2/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "session",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ProviderSessionNode",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/)
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
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "pages_indexQuery",
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
            "name": "brokers",
            "storageKey": null,
            "args": null,
            "concreteType": "BrokerNode",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "serviceProviders",
                "storageKey": null,
                "args": null,
                "concreteType": "ServiceProviderNodeConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ServiceProviderNodeEdge",
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
                          (v0/*: any*/),
                          (v1/*: any*/),
                          (v2/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "session",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ProviderSessionNode",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v0/*: any*/)
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
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "pages_indexQuery",
    "id": null,
    "text": "query pages_indexQuery {\n  viewer {\n    brokers {\n      id\n      databaseId\n      name\n      serviceProviders {\n        edges {\n          node {\n            id\n            databaseId\n            name\n            protocol\n            session {\n              status\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'd600d7a83f0641f2dbaedb855cb7a4d0';
export default node;
