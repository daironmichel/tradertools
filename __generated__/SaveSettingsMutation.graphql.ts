/* tslint:disable */
/* @relayHash 46870503cecf822486840af5f74cdb22 */

import { ConcreteRequest } from "relay-runtime";
export type SaveSettingsError = "DEFAULT_BROKER_REQUIRED" | "DEFAULT_PROVIDER_REQUIRED" | "INVALID_REFRESH_RATE" | "%future added value";
export type SaveSettingsInput = {
    readonly refreshRate?: number | null;
    readonly defaultBrokerId?: string | null;
    readonly defaultProviderId?: string | null;
    readonly defaultAccountId?: string | null;
    readonly clientMutationId?: string | null;
};
export type SaveSettingsMutationVariables = {
    input: SaveSettingsInput;
};
export type SaveSettingsMutationResponse = {
    readonly saveSettings: {
        readonly error: SaveSettingsError | null;
        readonly errorMessage: string | null;
        readonly settings: {
            readonly refreshRate: number;
        } | null;
    };
};
export type SaveSettingsMutation = {
    readonly response: SaveSettingsMutationResponse;
    readonly variables: SaveSettingsMutationVariables;
};



/*
mutation SaveSettingsMutation(
  $input: SaveSettingsInput!
) {
  saveSettings(input: $input) {
    error
    errorMessage
    settings {
      refreshRate
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SaveSettingsInput!",
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
  "name": "refreshRate",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaveSettingsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "saveSettings",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SaveSettingsPayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "SettingsNode",
            "plural": false,
            "selections": [
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaveSettingsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "saveSettings",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SaveSettingsPayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "SettingsNode",
            "plural": false,
            "selections": [
              (v4/*: any*/),
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
    "operationKind": "mutation",
    "name": "SaveSettingsMutation",
    "id": null,
    "text": "mutation SaveSettingsMutation(\n  $input: SaveSettingsInput!\n) {\n  saveSettings(input: $input) {\n    error\n    errorMessage\n    settings {\n      refreshRate\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '20552ef1bc1a7e32d9365a67f35692cb';
export default node;
