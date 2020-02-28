/* tslint:disable */
/* @relayHash 087640d1b7b7f4885e53c44738698ecf */

import { ConcreteRequest } from "relay-runtime";
export type AutoPilotOFFError = "NO_AUTOPILOT" | "%future added value";
export type AutoPilotOFFInput = {
    readonly symbol: string;
    readonly clientMutationId?: string | null;
};
export type AutoPilotOFFMutationVariables = {
    input: AutoPilotOFFInput;
};
export type AutoPilotOFFMutationResponse = {
    readonly autoPilotOff: {
        readonly error: AutoPilotOFFError | null;
        readonly errorMessage: string | null;
    };
};
export type AutoPilotOFFMutation = {
    readonly response: AutoPilotOFFMutationResponse;
    readonly variables: AutoPilotOFFMutationVariables;
};



/*
mutation AutoPilotOFFMutation(
  $input: AutoPilotOFFInput!
) {
  autoPilotOff(input: $input) {
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
    "type": "AutoPilotOFFInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "autoPilotOff",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AutoPilotOFFPayload",
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
    "name": "AutoPilotOFFMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "AutoPilotOFFMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "AutoPilotOFFMutation",
    "id": null,
    "text": "mutation AutoPilotOFFMutation(\n  $input: AutoPilotOFFInput!\n) {\n  autoPilotOff(input: $input) {\n    error\n    errorMessage\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'cb7b4b3e54178c857ba01acb7df82ac1';
export default node;
