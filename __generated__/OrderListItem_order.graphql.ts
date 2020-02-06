/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderListItem_order = {
    readonly orderId: string;
    readonly symbol: string;
    readonly filledQuantity: number;
    readonly orderedQuantity: number;
    readonly limitPrice: unknown;
    readonly stopPrice: unknown | null;
    readonly stopLimitPrice: unknown | null;
    readonly executionPrice: unknown;
    readonly status: string;
    readonly action: string;
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
      "name": "filledQuantity",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "orderedQuantity",
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
      "name": "stopPrice",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "stopLimitPrice",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "executionPrice",
      "args": null,
      "storageKey": null
    },
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
      "name": "action",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '1354cab53806c781f8cb14e057b5ef99';
export default node;
