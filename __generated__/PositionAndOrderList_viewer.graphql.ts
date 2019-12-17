/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionAndOrderList_viewer = {
    readonly " $fragmentRefs": FragmentRefs<"PositionList_viewer" | "OrderList_viewer">;
    readonly " $refType": "PositionAndOrderList_viewer";
};
export type PositionAndOrderList_viewer$data = PositionAndOrderList_viewer;
export type PositionAndOrderList_viewer$key = {
    readonly " $data"?: PositionAndOrderList_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"PositionAndOrderList_viewer">;
};



const node: ReaderFragment = (function(){
var v0 = [
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
];
return {
  "kind": "Fragment",
  "name": "PositionAndOrderList_viewer",
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
      "kind": "FragmentSpread",
      "name": "PositionList_viewer",
      "args": (v0/*: any*/)
    },
    {
      "kind": "FragmentSpread",
      "name": "OrderList_viewer",
      "args": (v0/*: any*/)
    }
  ]
};
})();
(node as any).hash = 'b18cde956a4ac739016a9711683a2723';
export default node;
