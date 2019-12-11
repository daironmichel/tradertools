import { graphql } from "react-relay";
import { Mutation } from "../relay";
import { SyncAccountsMutation as SyncAccountsMutationType } from "./__generated__/SyncAccountsMutation.graphql";

export default class SyncAccountsMutation extends Mutation<SyncAccountsMutationType> {
  mutation = graphql`
    mutation SyncAccountsMutation($input: SyncAccountsInput!) {
      syncAccounts(input: $input) {
        error
        errorMessage

        broker {
          id
          accounts {
            edges {
              node {
                id
                name
                accountId
                accountKey
              }
            }
          }
        }
      }
    }
  `;
}
