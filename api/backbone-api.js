const axios = require('axios');

// traing something
class BackboneAPI {
  constructor(apiHost = '') {
    const baseURL = `${apiHost}/api/`;
    this.axios = axios.create({
      baseURL: baseURL,
      headers: {
        Accept: 'application/json',
      },
    });
    this.cancelTokenSource = null;
  }

  async login(username, password) {
    const body = { username, password };
    const res = await this.axios.post('login/', body);
    return res.data.key;
  }

  async getCredentials(token) {
    const headers = { Authorization: `Token ${token}` };
    const res = await this.axios.get('credentials/', { headers });
    return res.data;
  }

  async logout(token) {
    const body = {};
    const headers = { Authorization: `Token ${token}` };
    const res = await this.axios.post('logout/', body, { headers });
    return res.data;
  }

  async verify(oauthToken, oauthVerifier) {
    const body = { oauthToken, oauthVerifier };
    const res = await this.axios.post('oauth1/verify/', body);
    return res.data;
  }

  graphQL(query, variables = {}, headers = {}) {
    // let reqHeaders = R.merge(this.getSessionIdHeaders(), headers);
    const body = { query, variables };

    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    const req = this.axios.post('gql/', body, {
      headers: headers,
      cancelToken: this.cancelTokenSource.token,
    });

    // req = this.defaultErrorHandler(req);

    return req;
  }
}

module.exports = BackboneAPI;
