import { graphql } from "react-relay";
import { Mutation } from "../relay";
import { CancelOrderMutation as CancelOrderMutationType } from "../../__generated__/CancelOrderMutation.graphql";

export default class CancelOrderMutation extends Mutation<CancelOrderMutationType> {
  mutation = graphql`
    mutation CancelOrderMutation($input: CancelOrderInput!) {
      cancelOrder(input: $input) {
        error
        errorMessage
      }
    }
  `;
}
