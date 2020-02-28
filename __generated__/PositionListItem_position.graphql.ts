/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AutoPilotTaskState = "BUYING" | "ERROR" | "SELLING" | "WATCHING" | "%future added value";
export type AutoPilotTaskStatus = "DONE" | "PAUSED" | "QUEUED" | "READY" | "RUNNING" | "%future added value";
export type PositionListItem_position = {
    readonly symbol: string;
    readonly quantity: number;
    readonly pricePaid: unknown;
    readonly totalGain: unknown;
    readonly totalGainPct: unknown;
    readonly autopilot: {
        readonly status: AutoPilotTaskStatus;
        readonly state: AutoPilotTaskState;
        readonly errorMessage: string;
    } | null;
    readonly " $refType": "PositionListItem_position";
};
export type PositionListItem_position$data = PositionListItem_position;
export type PositionListItem_position$key = {
    readonly " $data"?: PositionListItem_position$data;
    readonly " $fragmentRefs": FragmentRefs<"PositionListItem_position">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PositionListItem_position",
  "type": "PositionType",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "symbol",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "quantity",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "pricePaid",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "totalGain",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "totalGainPct",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "autopilot",
      "storageKey": null,
      "args": null,
      "concreteType": "AutoPilotTaskNode",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "status",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "state",
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
  ]
};
(node as any).hash = '8332f5ebb46c0e4c1c2dafb0c9d41a62';
export default node;
