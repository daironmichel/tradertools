import crypto from 'crypto';
import { addHours, endOfDay, endOfToday, isAfter, isBefore } from 'date-fns';
import querystring, { ParsedUrlQuery } from 'querystring';
import axios, { AxiosRequestConfig } from 'axios';
import OAuth from 'oauth-1.0a';
import { IBroker } from './common';
import { BrokerAuth, BrokerAuths } from '../db';
import { Broker } from './index';

const dev = process.env.NODE_ENV !== 'production';

const getOauth = (token?: OAuth.Token): OAuth => {
  return new OAuth({
    consumer: token || {
      key: process.env.ETRADE_CONSUMER_KEY || '',
      secret: process.env.ETRADE_CONSUMER_SECRET || '',
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function (base_string: string, key: string): string {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
  });
};

interface EtradeRequestToken extends ParsedUrlQuery {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: 'true' | 'false';
}

interface EtradeAccessToken extends ParsedUrlQuery {
  oauth_token: string;
  oauth_token_secret: string;
}

class ETrade implements IBroker {
  private readonly authorizeURL = 'https://us.etrade.com/e/t/etws/authorize';
  private readonly requestTokenURL = 'https://api.etrade.com/oauth/request_token';
  private readonly accessTokenURL = 'https://api.etrade.com/oauth/access_token';
  private readonly refreshTokenURL = 'https://api.etrade.com/oauth/renew_access_token';
  private readonly revokeTokenURL = 'https://api.etrade.com/oauth/revoke_access_token';
  private readonly apiURL = dev ? 'https://apisb.etrade.com/v1' : 'https://api.etrade.com/v1';
  private readonly axios = axios.create({
    // baseURL: 'https://some-domain.com/api/',
    timeout: parseInt(process.env.ETRADE_API_REQUEST_TIMEOUT || '120000'),
  });

  private authorizeConfig() {
    const oauth = getOauth();
    const requestData: OAuth.RequestOptions & AxiosRequestConfig = {
      url: this.requestTokenURL,
      method: 'GET',
      data: { oauth_callback: 'oob' },
    };

    const config: AxiosRequestConfig = {
      headers: oauth.toHeader(oauth.authorize(requestData)),
      ...requestData,
    };
    return config;
  }

  async getAuthorizeURL(userId?: number): Promise<string> {
    const config = this.authorizeConfig();

    try {
      const res = await this.axios.request(config);
      const tokenResponse = querystring.parse(res.data) as EtradeRequestToken;

      if (userId) {
        const authData: Partial<BrokerAuth> = {
          userId,
          broker: Broker.ETrade,
          oauth1RequestToken: tokenResponse.oauth_token,
          oauth1RequestTokenSecret: tokenResponse.oauth_token_secret,
        };

        const brokerAuth = await BrokerAuths().where({ userId, broker: Broker.ETrade }).select(['id']).first();

        if (brokerAuth) {
          await BrokerAuths().where(brokerAuth).update(authData);
        } else {
          await BrokerAuths().insert(authData);
        }
      }

      return `${this.authorizeURL}?key=${process.env.ETRADE_CONSUMER_KEY || ''}&token=${tokenResponse.oauth_token}`;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  private requestAccessConfig(brokerAuth: BrokerAuth, oauthVerifier: string) {
    const token = {
      key: brokerAuth.oauth1RequestToken,
      secret: brokerAuth.oauth1RequestTokenSecret,
    };

    const oauth = getOauth();
    const requestData: OAuth.RequestOptions & AxiosRequestConfig = {
      method: 'GET',
      url: this.accessTokenURL,
      data: { oauth_verifier: oauthVerifier, oauth_token: brokerAuth.oauth1RequestToken },
    };

    const config: AxiosRequestConfig = {
      headers: oauth.toHeader(oauth.authorize(requestData, token)),
      ...requestData,
    };
    return config;
  }

  async getAccess(oauthVerifier: string, brokerAuth: BrokerAuth): Promise<boolean> {
    const config = this.requestAccessConfig(brokerAuth, oauthVerifier);

    try {
      const res = await this.axios.request(config);
      const tokenResponse = querystring.parse(res.data) as EtradeAccessToken;
      await updateAccess(tokenResponse, brokerAuth);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private refreshAccessConfig(brokerAuth: BrokerAuth) {
    const token = {
      key: brokerAuth.oauth1RefreshToken,
      secret: brokerAuth.oauth1AccessTokenSecret,
    };

    const oauth = getOauth();
    const requestData: OAuth.RequestOptions & AxiosRequestConfig = {
      method: 'GET',
      url: this.refreshTokenURL,
      data: { oauth_token: brokerAuth.oauth1RefreshToken },
    };

    const config: AxiosRequestConfig = {
      headers: oauth.toHeader(oauth.authorize(requestData, token)),
      ...requestData,
    };
    return config;
  }

  async refreshAccess(brokerAuth: BrokerAuth): Promise<boolean> {
    const config = this.refreshAccessConfig(brokerAuth);

    try {
      const res = await this.axios.request(config);
      const tokenResponse = querystring.parse(res.data) as EtradeAccessToken;
      await updateAccess(tokenResponse, brokerAuth);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private revokeAccessConfig(brokerAuth: BrokerAuth) {
    const token = {
      key: brokerAuth.oauth1AccessToken,
      secret: brokerAuth.oauth1AccessTokenSecret,
    };

    const oauth = getOauth();
    const requestData: OAuth.RequestOptions & AxiosRequestConfig = {
      method: 'GET',
      url: this.revokeTokenURL,
      data: { oauth_token: brokerAuth.oauth1AccessToken },
    };

    const config: AxiosRequestConfig = {
      headers: oauth.toHeader(oauth.authorize(requestData, token)),
      ...requestData,
    };
    return config;
  }

  async revokeAccess(brokerAuth: BrokerAuth): Promise<boolean> {
    const config = this.revokeAccessConfig(brokerAuth);

    try {
      await this.axios.request(config);
      await BrokerAuths().where('id', brokerAuth.id).delete();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async request(config: AxiosRequestConfig, brokerAuth: BrokerAuth): Promise<any> {
    const now = new Date();
    const tokenExpired = isAfter(now, brokerAuth.oauth1AccessTokenExpiresAt);
    if (tokenExpired) {
      const canRefresh = isBefore(brokerAuth.oauth1AccessTokenExpiresAt, endOfToday());
      let accessRefreshed = false;
      if (canRefresh) accessRefreshed = await this.refreshAccess(brokerAuth);
      else throw new Error('ETrade access token expired.');

      if (!accessRefreshed) throw new Error('Unable to refresh access token.');
    }

    // TODO: build request config and make request
    const token = {
      key: brokerAuth.oauth1AccessToken,
      secret: brokerAuth.oauth1AccessTokenSecret,
    };

    const oauth = getOauth();
    const requestData: OAuth.RequestOptions & AxiosRequestConfig = {
      method: 'GET',
      url: this.revokeTokenURL,
      data: { oauth_token: brokerAuth.oauth1AccessToken },
    };

    const requestConfig: AxiosRequestConfig = {};
  }
}

/**
 * For ETrade access tokens become "inactive" after two hours of inactivity
 * and "expired" at midnight US Eastern timezone. An "inactive" token can be
 * reactivated by calling https://api.etrade.com/oauth/renew_access_token
 */
export function getAccessTokenInactivityExpirationTime(from: Date = new Date()): Date {
  const midnight = endOfDay(from);
  const twoHoursAfter = addHours(from, 2);
  if (twoHoursAfter > midnight) return midnight;
  return twoHoursAfter;
}

async function updateAccess(tokenResponse: EtradeAccessToken, brokerAuth: BrokerAuth) {
  const authData: Partial<BrokerAuth> = {
    oauth1AccessToken: tokenResponse.oauth_token,
    oauth1AccessTokenSecret: tokenResponse.oauth_token_secret,
    oauth1AccessTokenExpiresAt: getAccessTokenInactivityExpirationTime(),
    oauth1RefreshToken: tokenResponse.oauth_token,
    oauth1RefreshTokenExpiresAt: endOfToday(),
  };

  await BrokerAuths().where('id', brokerAuth.id).update(authData);
  Object.assign(brokerAuth, authData);
}

export default ETrade;
