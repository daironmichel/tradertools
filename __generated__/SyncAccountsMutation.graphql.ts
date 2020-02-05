/* tslint:disable */
/* @relayHash e935db1827521f1783c99e3c1ed69f61 */

import { ConcreteRequest } from "relay-runtime";
export type AuthorizeConnectionError = "INCOMPATIBLE_STATE" | "MISSING_REQUIRED_FIELD" | "PROVIDER_NOT_FOUND" | "%future added value";
export type SyncAccountsInput = {
    readonly providerId: string;
    readonly clientMutationId?: string | null;
};
export type SyncAccountsMutationVariables = {
    input: SyncAccountsInput;
};
export type SyncAccountsMutationResponse = {
    readonly syncAccounts: {
        readonly error: AuthorizeConnectionError | null;
        readonly errorMessage: string | null;
        readonly broker: {
            readonly id: string;
            readonly accounts: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly id: string;
                        readonly name: string;
                        readonly accountId: string;
                        readonly accountKey: string;
                    };
                }>;
            };
        } | null;
    };
};
export type SyncAccountsMutation = {
    readonly response: SyncAccountsMutationResponse;
    readonly variables: SyncAccountsMutationVariables;
};



/*
mutation SyncAccountsMutation(
  $input: SyncAccountsInput!
) {
  syncAccounts(input: $input) {
    error
    errorMessage
    broker {
      id
      accounts {
        edges {
          node {
            id
            name
            accountId
            accountKey
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
    "name": "input",
    "type": "SyncAccountsInput!",
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
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "syncAccounts",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SyncAccountsPayload",
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
        "kind": "LinkedField",
        "alias": null,
        "name": "broker",
        "storageKey": null,
        "args": null,
        "concreteType": "BrokerNode",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "accounts",
            "storageKey": null,
            "args": null,
            "concreteType": "AccountConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "AccountEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AccountNode",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
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
                        "name": "accountId",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "accountKey",
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
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SyncAccountsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SyncAccountsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SyncAccountsMutation",
    "id": null,
    "text": "mutation SyncAccountsMutation(\n  $input: SyncAccountsInput!\n) {\n  syncAccounts(input: $input) {\n    error\n    errorMessage\n    broker {\n      id\n      accounts {\n        edges {\n          node {\n            id\n            name\n            accountId\n            accountKey\n          }\n        }\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '0f522aaa746fa764eb7f797caca6cc4d';
export default node;
