/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionListItem_position = {
    readonly symbol: string;
    readonly quantity: number;
    readonly pricePaid: unknown;
    readonly totalGain: unknown;
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
    }
  ]
};
(node as any).hash = '0ebe38c5e12ba5a8aa3dd1d23f54b38e';
export default node;
