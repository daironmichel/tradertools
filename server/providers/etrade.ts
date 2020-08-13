import crypto from 'crypto';
import querystring, { ParsedUrlQuery } from 'querystring';
import axios, { AxiosRequestConfig } from 'axios';
import OAuth from 'oauth-1.0a';
import { IBroker } from './common';

const dev = process.env.NODE_ENV !== 'production';

const oauth = new OAuth({
  consumer: {
    key: process.env.ETRADE_CONSUMER_KEY || '',
    secret: process.env.ETRADE_CONSUMER_SECRET || '',
  },
  signature_method: 'HMAC-SHA1',
  hash_function: function (base_string: string, key: string): string {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

interface RequestTokenResponse extends ParsedUrlQuery {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: 'true' | 'false';
}

class ETrade implements IBroker {
  private readonly authorizeURL = 'https://us.etrade.com/e/t/etws/authorize';
  private readonly requestTokenURL = 'https://api.etrade.com/oauth/request_token';
  private readonly accessTokenURL = 'https://api.etrade.com/oauth/access_token';
  private readonly refreshTokenURL = 'https://api.etrade.com/oauth/renew_access_token';
  private readonly revokeTokenURL = 'https://api.etrade.com/oauth/revoke_access_token';
  private readonly apiURL = dev ? 'https://apisb.etrade.com/v1' : 'https://api.etrade.com/v1';

  async getAuthorizeURL(userId?: number): Promise<string> {
    const requestData: OAuth.RequestOptions = {
      url: this.requestTokenURL,
      method: 'GET',
      data: { oauth_callback: 'oob' },
    };

    const config: AxiosRequestConfig = {
      timeout: parseInt(process.env.ETRADE_API_REQUEST_TIMEOUT || '120000'),
      headers: oauth.toHeader(oauth.authorize(requestData)),
    };

    try {
      const res = await axios.get(this.requestTokenURL, config);
      const tokenResponse = querystring.parse(res.data) as RequestTokenResponse;

      if (userId) {
        // TODO: save tokenResponse to db
      }

      return `${this.authorizeURL}?key=${oauth.consumer.key}&token=${tokenResponse.oauth_token}`;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  async authorize(oathVerifier: string, oathToken: string): Promise<boolean> {
    // callback example
    // https://trader.dleyva.com/verify?oauth_token=DV%2FZjwwcLSofaNar9HlMvH6Y%2FaLN5waR80OWA3S7Rzg%3D&oauth_verifier=5STD2
  }
}

export default ETrade;
