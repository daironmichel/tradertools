/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PositionList_viewer = {
    readonly positions: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"PositionListItem_position">;
    }>;
    readonly " $refType": "PositionList_viewer";
};
export type PositionList_viewer$data = PositionList_viewer;
export type PositionList_viewer$key = {
    readonly " $data"?: PositionList_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"PositionList_viewer">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PositionList_viewer",
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
      "name": "positions",
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
      "concreteType": "PositionType",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "PositionListItem_position",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '2d9456801a30b9c8fa6598a49156a7ad';
export default node;
