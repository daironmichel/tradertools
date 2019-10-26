import axios, { AxiosInstance, CancelTokenSource, AxiosResponse } from "axios";

// traing something
export default class BackboneAPI {
  axios: AxiosInstance;
  cancelTokenSource: CancelTokenSource | null;

  constructor(apiHost: string = "") {
    const baseURL = `${apiHost}/api/`;
    this.axios = axios.create({
      baseURL: baseURL,
      headers: {
        Accept: "application/json"
      }
    });
    this.cancelTokenSource = null;
  }

  async login(username: string, password: string): Promise<string> {
    const body = { username, password };
    const res = await this.axios.post("login/", body);
    return res.data.key;
  }

  async logout(token: string): Promise<object> {
    const body = {};
    const headers = { Authorization: `Token ${token}` };
    const res = await this.axios.post("logout/", body, { headers });
    return res.data;
  }

  graphQL(query: string, variables: object = {}, headers = {}): Promise<AxiosResponse<any>> {
    // let reqHeaders = R.merge(this.getSessionIdHeaders(), headers);
    const body = { query, variables };

    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    let req = this.axios.post("gql/", body, {
      headers: headers,
      cancelToken: this.cancelTokenSource.token
    });

    // req = this.defaultErrorHandler(req);

    return req;
  }
}
