import axios, { AxiosInstance, CancelTokenSource } from 'axios';

// traing something
export default class EtradeAPI {
  axios: AxiosInstance;
  cancelTokenSource: CancelTokenSource | null;

  constructor(apiHost = '') {
    const baseURL = `${apiHost}/api/etrade/`;
    this.axios = axios.create({
      baseURL: baseURL,
      headers: {
        Accept: 'application/json',
      },
    });
    this.cancelTokenSource = null;
  }

  async verify(code: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const params = { oauth_verifier: code };
    try {
      await this.axios.post('oauth', null, { params });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
