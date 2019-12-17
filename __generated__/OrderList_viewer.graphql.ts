/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderList_viewer = {
    readonly orders: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"OrderListItem_order">;
    }>;
    readonly " $refType": "OrderList_viewer";
};
export type OrderList_viewer$data = OrderList_viewer;
export type OrderList_viewer$key = {
    readonly " $data"?: OrderList_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderList_viewer">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "OrderList_viewer",
  "type": "ViewerType",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "providerId",
      "type": "ID!",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "accountId",
      "type": "ID",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "orders",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "accountId",
          "variableName": "accountId"
        },
        {
          "kind": "Variable",
          "name": "providerId",
          "variableName": "providerId"
        }
      ],
      "concreteType": "OrderType",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "OrderListItem_order",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '36b7877764f9b05302b1f97effb6160f';
export default node;
