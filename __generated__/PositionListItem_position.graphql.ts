/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionListItem_position = {
    readonly symbol: string;
    readonly quantity: number;
    readonly pricePaid: unknown;
    readonly totalGain: unknown;
    readonly totalGainPct: unknown;
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
    }
  ]
};
(node as any).hash = 'e252cb16c64bffd05de44e42a6d950a5';
export default node;
