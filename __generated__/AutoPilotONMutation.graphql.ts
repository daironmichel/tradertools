/* tslint:disable */
/* @relayHash 3a7d9039b93ff9cba2c1be0c71061f19 */

import { ConcreteRequest } from "relay-runtime";
export type AutoPilotONError = "ACCOUNT_REQUIRED" | "ALREADY_EXISTS" | "NO_POSITION_FOR_SYMBOL" | "PROVIDER_REQUIRED" | "STRATEGY_REQUIRED" | "%future added value";
export type AutoPilotTaskModifier = "FOLLOW_STRATEGY" | "MAXIMIZE_PROFIT" | "MINIMIZE_LOSS" | "MIN_LOSS_MAX_PROFIT" | "%future added value";
export type AutoPilotONInput = {
    readonly symbol: string;
    readonly strategyId?: string | null;
    readonly providerId?: string | null;
    readonly accountId?: string | null;
    readonly modifier?: AutoPilotTaskModifier | null;
    readonly clientMutationId?: string | null;
};
export type AutoPilotONMutationVariables = {
    input: AutoPilotONInput;
};
export type AutoPilotONMutationResponse = {
    readonly autoPilotOn: {
        readonly error: AutoPilotONError | null;
        readonly errorMessage: string | null;
    };
};
export type AutoPilotONMutation = {
    readonly response: AutoPilotONMutationResponse;
    readonly variables: AutoPilotONMutationVariables;
};



/*
mutation AutoPilotONMutation(
  $input: AutoPilotONInput!
) {
  autoPilotOn(input: $input) {
    error
    errorMessage
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AutoPilotONInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "autoPilotOn",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AutoPilotONPayload",
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
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AutoPilotONMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "AutoPilotONMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "AutoPilotONMutation",
    "id": null,
    "text": "mutation AutoPilotONMutation(\n  $input: AutoPilotONInput!\n) {\n  autoPilotOn(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '1ce44c8ed9cd8b0e83f64d84f66006e6';
export default node;
