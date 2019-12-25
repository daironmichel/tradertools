/* tslint:disable */
/* @relayHash 8b8fab99e8c0651cb713eea14860686d */

import { ConcreteRequest } from "relay-runtime";
export type SessionStatus = "CLOSED" | "CONNECTED" | "EXPIRED" | "INACTIVE" | "REQUESTING" | "%future added value";
export type ProviderSlugQueryVariables = {
    brokerSlug: string;
    providerSlug: string;
};
export type ProviderSlugQueryResponse = {
    readonly viewer: {
        readonly settings: {
            readonly refreshRate: number;
            readonly defaultStrategy: {
                readonly id: string;
                readonly databaseId: number;
                readonly name: string;
                readonly exposurePercent: number;
                readonly profitPercent: number;
                readonly lossPercent: number;
            } | null;
        } | null;
        readonly tradingStrategies: ReadonlyArray<{
            readonly id: string;
            readonly databaseId: number;
            readonly name: string;
            readonly exposurePercent: number;
            readonly profitPercent: number;
            readonly lossPercent: number;
        }>;
        readonly broker: {
            readonly id: string;
            readonly databaseId: number;
            readonly name: string;
            readonly serviceProvider: {
                readonly id: string;
                readonly databaseId: number;
                readonly name: string;
                readonly sessionStatus: SessionStatus;
            } | null;
        } | null;
    };
};
export type ProviderSlugQuery = {
    readonly response: ProviderSlugQueryResponse;
    readonly variables: ProviderSlugQueryVariables;
};



/*
query ProviderSlugQuery(
  $brokerSlug: String!
  $providerSlug: String!
) {
  viewer {
    settings {
      refreshRate
      defaultStrategy {
        id
        databaseId
        name
        exposurePercent
        profitPercent
        lossPercent
      }
      id
    }
    tradingStrategies {
      id
      databaseId
      name
      exposurePercent
      profitPercent
      lossPercent
    }
    broker(slug: $brokerSlug) {
      id
      databaseId
      name
      serviceProvider(slug: $providerSlug) {
        id
        databaseId
        name
        sessionStatus
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "brokerSlug",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "providerSlug",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "refreshRate",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "databaseId",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "exposurePercent",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "profitPercent",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "lossPercent",
    "args": null,
    "storageKey": null
  }
],
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "defaultStrategy",
  "storageKey": null,
  "args": null,
  "concreteType": "TradingStrategyNode",
  "plural": false,
  "selections": (v5/*: any*/)
},
v7 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "tradingStrategies",
  "storageKey": null,
  "args": null,
  "concreteType": "TradingStrategyNode",
  "plural": true,
  "selections": (v5/*: any*/)
},
v8 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "broker",
  "storageKey": null,
  "args": [
    {
      "kind": "Variable",
      "name": "slug",
      "variableName": "brokerSlug"
    }
  ],
  "concreteType": "BrokerNode",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "serviceProvider",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "providerSlug"
        }
      ],
      "concreteType": "ServiceProviderNode",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "sessionStatus",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ProviderSlugQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "ViewerType",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "SettingsNode",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v6/*: any*/)
            ]
          },
          (v7/*: any*/),
          (v8/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ProviderSlugQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "ViewerType",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "SettingsNode",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v6/*: any*/),
              (v2/*: any*/)
            ]
          },
          (v7/*: any*/),
          (v8/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ProviderSlugQuery",
    "id": null,
    "text": "query ProviderSlugQuery(\n  $brokerSlug: String!\n  $providerSlug: String!\n) {\n  viewer {\n    settings {\n      refreshRate\n      defaultStrategy {\n        id\n        databaseId\n        name\n        exposurePercent\n        profitPercent\n        lossPercent\n      }\n      id\n    }\n    tradingStrategies {\n      id\n      databaseId\n      name\n      exposurePercent\n      profitPercent\n      lossPercent\n    }\n    broker(slug: $brokerSlug) {\n      id\n      databaseId\n      name\n      serviceProvider(slug: $providerSlug) {\n        id\n        databaseId\n        name\n        sessionStatus\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '702b12cf0b3aaee30adec38fc7bc7159';
export default node;
