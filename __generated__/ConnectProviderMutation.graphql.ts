/* tslint:disable */
/* @relayHash c306a7f56bc67883bb42ece840c14f4a */

import { ConcreteRequest } from "relay-runtime";
export type ConnectProviderError = "PROVIDER_NOT_FOUND" | "%future added value";
export type SessionStatus = "CLOSED" | "CONNECTED" | "EXPIRED" | "INACTIVE" | "REQUESTING" | "%future added value";
export type ConnectProviderInput = {
    readonly providerId: string;
    readonly clientMutationId?: string | null;
};
export type ConnectProviderMutationVariables = {
    input: ConnectProviderInput;
};
export type ConnectProviderMutationResponse = {
    readonly connectProvider: {
        readonly error: ConnectProviderError | null;
        readonly errorMessage: string | null;
        readonly authorizeUrl: string | null;
        readonly callbackEnabled: boolean | null;
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
    };
};
export type ConnectProviderMutation = {
    readonly response: ConnectProviderMutationResponse;
    readonly variables: ConnectProviderMutationVariables;
};



/*
mutation ConnectProviderMutation(
  $input: ConnectProviderInput!
) {
  connectProvider(input: $input) {
    error
    errorMessage
    authorizeUrl
    callbackEnabled
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
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "ConnectProviderInput!",
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
v3 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "connectProvider",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ConnectProviderPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "error",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "errorMessage",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "authorizeUrl",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "callbackEnabled",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "serviceProvider",
        "storageKey": null,
        "args": null,
        "concreteType": "ServiceProviderNode",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConnectProviderMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ConnectProviderMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ConnectProviderMutation",
    "id": null,
    "text": "mutation ConnectProviderMutation(\n  $input: ConnectProviderInput!\n) {\n  connectProvider(input: $input) {\n    error\n    errorMessage\n    authorizeUrl\n    callbackEnabled\n    serviceProvider {\n      id\n      databaseId\n      name\n      slug\n      session {\n        id\n        databaseId\n        status\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '92efc7add08a700e13b166ad77cc31a3';
export default node;
