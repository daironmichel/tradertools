import { graphql } from "react-relay";
import { Mutation } from "../relay";
import { BuyStockMutation as BuyStockMutationType } from "./__generated__/BuyStockMutation.graphql";

export default class BuyStockMutation extends Mutation<BuyStockMutationType> {
  mutation = graphql`
    mutation BuyStockMutation($input: BuyStockInput!) {
      buyStock(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
