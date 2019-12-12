/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderListItem_order = {
    readonly orderId: string;
    readonly symbol: string;
    readonly quantity: number;
    readonly limitPrice: unknown;
    readonly status: string;
    readonly " $refType": "OrderListItem_order";
};
export type OrderListItem_order$data = OrderListItem_order;
export type OrderListItem_order$key = {
    readonly " $data"?: OrderListItem_order$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderListItem_order">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "OrderListItem_order",
  "type": "OrderType",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "orderId",
      "args": null,
      "storageKey": null
    },
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
      "name": "limitPrice",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'f4b13b44ff5e4f5d6730c509e98966e1';
export default node;
