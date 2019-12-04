/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type AuthorizeConnectionError = "INCOMPATIBLE_STATE" | "PROVIDER_NOT_FOUND" | "%future added value";
export type SessionStatus = "CLOSED" | "CONNECTED" | "EXPIRED" | "INACTIVE" | "REQUESTING" | "%future added value";
export type AuthorizeConnectionInput = {
    readonly providerId?: string | null;
    readonly oauthVerifier?: string | null;
    readonly clientMutationId?: string | null;
};
export type AuthorizeConnectionMutationVariables = {
    input: AuthorizeConnectionInput;
};
export type AuthorizeConnectionMutationResponse = {
    readonly authorizeConnection: {
        readonly error: AuthorizeConnectionError | null;
        readonly errorMessage: string | null;
        readonly serviceProvider: {
            readonly id: string;
            readonly databaseId: number | null;
            readonly name: string;
            readonly slug: string;
            readonly session: {
                readonly id: string;
                readonly databaseId: number | null;
                readonly status: SessionStatus | null;
            } | null;
            readonly broker: {
                readonly slug: string;
            } | null;
        } | null;
    } | null;
};
export type AuthorizeConnectionMutation = {
    readonly response: AuthorizeConnectionMutationResponse;
    readonly variables: AuthorizeConnectionMutationVariables;
};



/*
mutation AuthorizeConnectionMutation(
  $input: AuthorizeConnectionInput!
) {
  authorizeConnection(input: $input) {
    error
    errorMessage
    serviceProvider {
      id
      databaseId
      name
      slug
      session {
        id
        databaseId
        status
      }
      broker {
        slug
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AuthorizeConnectionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "error",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "errorMessage",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "databaseId",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "session",
  "storageKey": null,
  "args": null,
  "concreteType": "ProviderSessionNode",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/),
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
    "name": "AuthorizeConnectionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "authorizeConnection",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AuthorizeConnectionPayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "serviceProvider",
            "storageKey": null,
            "args": null,
            "concreteType": "ServiceProviderNode",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "broker",
                "storageKey": null,
                "args": null,
                "concreteType": "BrokerNode",
                "plural": false,
                "selections": [
                  (v7/*: any*/)
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
    "name": "AuthorizeConnectionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "authorizeConnection",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AuthorizeConnectionPayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "serviceProvider",
            "storageKey": null,
            "args": null,
            "concreteType": "ServiceProviderNode",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "broker",
                "storageKey": null,
                "args": null,
                "concreteType": "BrokerNode",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v4/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "AuthorizeConnectionMutation",
    "id": null,
    "text": "mutation AuthorizeConnectionMutation(\n  $input: AuthorizeConnectionInput!\n) {\n  authorizeConnection(input: $input) {\n    error\n    errorMessage\n    serviceProvider {\n      id\n      databaseId\n      name\n      slug\n      session {\n        id\n        databaseId\n        status\n      }\n      broker {\n        slug\n        id\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'ca676abd7daab61de81bdebaa0fd8bbb';
export default node;
