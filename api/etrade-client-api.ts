import axios, { AxiosInstance, CancelTokenSource, AxiosResponse } from "axios";

// traing something
export default class EtradeAPI {
  axios: AxiosInstance;
  cancelTokenSource: CancelTokenSource | null;

  constructor(apiHost: string = "") {
    const baseURL = `${apiHost}/api/etrade/`;
    this.axios = axios.create({
      baseURL: baseURL,
      headers: {
        Accept: "application/json"
      }
    });
    this.cancelTokenSource = null;
  }

  async verify(oauth_verifier: string): Promise<boolean> {
    const params = { oauth_verifier };
    try {
      await this.axios.post("oauth", null, { params });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
