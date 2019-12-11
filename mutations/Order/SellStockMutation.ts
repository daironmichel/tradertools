import { graphql } from "react-relay";
import { Mutation } from "../relay";
import { SellStockMutation as SellStockMutationType } from "./__generated__/SellStockMutation.graphql";

export default class SellStockMutation extends Mutation<SellStockMutationType> {
  mutation = graphql`
    mutation SellStockMutation($input: SellStockInput!) {
      sellStock(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
