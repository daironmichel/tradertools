import { graphql } from 'react-relay';
import { Mutation } from '../relay';
import { SaveSettingsMutation as SaveSettingsMutationType } from '../../__generated__/SaveSettingsMutation.graphql';

export default class SaveSettingsMutation extends Mutation<SaveSettingsMutationType> {
  mutation = graphql`
    mutation SaveSettingsMutation($input: SaveSettingsInput!) {
      saveSettings(input: $input) {
        error
        errorMessage
        settings {
          refreshRate
        }
      }
    }
  `;
}
