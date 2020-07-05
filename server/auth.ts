import crypto from 'crypto';
import config from './config';
import { UserRecord, User } from './db';
import jwt from 'jsonwebtoken';
import { FastifyReply, FastifyRequest } from 'fastify';
import db from './db/db';

export interface PasswordHashingOptions {
  keylen: number;
  iterations: number;
  algorithm: string;
}

export async function hashPassword(
  rawPassword: string,
  salt?: string,
  options?: PasswordHashingOptions
): Promise<string> {
  const { algorithm, iterations, keylen } = options || config.passwordHasher;
  const saltValue = salt || crypto.randomBytes(16).toString('hex');

  const derivedKeyPromise = new Promise<string>((resolve, reject) => {
    let saltedPassword = [saltValue, rawPassword].join('$');
    crypto.pbkdf2(saltedPassword, saltValue, iterations, keylen, algorithm, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey.toString('hex'));
    });
  });

  const pwdHash = await derivedKeyPromise;

  return [algorithm, iterations, keylen, saltValue, pwdHash].join('$');
}

export async function compare(rawPassword: string, storedPassword: string): Promise<boolean> {
  const [algorithm, iterations, keylen, saltValue] = storedPassword.split('$');

  const hashedPassword = await hashPassword(rawPassword, saltValue, {
    keylen: parseInt(keylen),
    iterations: parseInt(iterations),
    algorithm,
  });

  return hashedPassword === storedPassword;
}

export interface AccessTokenPayload {
  userId: number;
}

export async function getAccessToken(user: UserRecord): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const { id: userId } = user;
    if (!userId) {
      console.error('User record does not have a valid id.');
      reject(new Error('Unable to generate access token.'));
      return;
    }

    const payload: AccessTokenPayload = { userId };
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const expiration = process.env.ACCESS_TOKEN_EXPIRATION || '15m';

    if (!secretKey) {
      console.error('ACCESS_TOKEN_SECRET_KEY environment variable is not defined.');
      reject(new Error('Unable to generate access token.'));
      return;
    }

    jwt.sign(payload, secretKey, { expiresIn: expiration }, (error, token) => {
      if (error) reject(error);
      else resolve(token);
    });
  });
}

export interface RefreshTokenPayload {
  userId: number;
  tokenVersion: number;
}

export async function getRefreshToken(user: UserRecord): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const { id: userId, tokenVersion } = user;
    if (!userId) {
      console.error('User record does not have a valid id.');
      reject(new Error('Unable to generate refresh token.'));
      return;
    }

    if (typeof tokenVersion !== 'number') {
      console.error('User record does not have a valid token version.');
      reject(new Error('Unable to generate refresh token.'));
      return;
    }

    const payload: RefreshTokenPayload = { userId, tokenVersion };
    const secretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
    const expiration = process.env.REFRESH_TOKEN_EXPIRATION || '7m';

    if (!secretKey) {
      console.error('REFRESH_TOKEN_SECRET_KEY environment variable is not defined.');
      reject(new Error('Unable to generate refresh token.'));
      return;
    }

    jwt.sign(payload, secretKey, { expiresIn: expiration }, (error, token) => {
      if (error) reject(error);
      else resolve(token);
    });
  });
}

export type MaybeAccessTokenPayload = AccessTokenPayload | undefined;

export async function verifyAccessHeader(request: FastifyRequest): Promise<MaybeAccessTokenPayload> {
  return new Promise<MaybeAccessTokenPayload>((resolve, reject) => {
    const authorization = request.headers['Authorization'];
    if (!authorization) {
      resolve();
      return;
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!secretKey) {
      console.error('ACCESS_TOKEN_SECRET_KEY environment variable is not defined.');
      reject(new Error('Unable to verify access token.'));
      return;
    }

    const [authType, token]: string[] = authorization.split(' ');

    if (!authType || authType.toLowerCase() !== 'bearer' || !token) {
      resolve();
      return;
    }

    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      const { payload } = (decoded || {}) as any;
      if (!payload) {
        resolve();
        return;
      }

      const { userId } = payload;

      if (!userId) {
        resolve();
        return;
      }

      resolve(payload);
    });
  });
}

export type MaybeRefreshTokenPayload = RefreshTokenPayload | undefined;

export async function verifyRefreshCookie(
  request: FastifyRequest,
  reply: FastifyReply<unknown>
): Promise<MaybeRefreshTokenPayload> {
  return new Promise<MaybeRefreshTokenPayload>((resolve, reject) => {
    const token = reply.unsignCookie(request.cookies.jid);

    if (!token) {
      resolve();
      return;
    }

    const secretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
    if (!secretKey) {
      console.error('REFRESH_TOKEN_SECRET_KEY environment variable is not defined.');
      reject(new Error('Unable to verify refresh token.'));
      return;
    }

    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      const { payload } = (decoded || {}) as any;
      if (!payload) {
        console.error('Trying to refresh a token without a payload.');
        resolve();
        return;
      }

      const { userId, tokenVersion } = payload;

      if (!userId) {
        console.error('Trying to refresh a token without userId in payload.');
        resolve();
        return;
      }

      if (typeof tokenVersion !== 'number') {
        console.error('Trying to refresh a token without tokenVersion in payload.');
        resolve();
        return;
      }

      db<User>('User')
        .where({ id: userId })
        .select(['id', 'tokenVersion'])
        .first()
        .then((user) => {
          if (!user) {
            console.error(`Trying to refresh a token for a user that does not exists. userId=${userId}`);
            resolve();
            return;
          }

          if (tokenVersion !== user.tokenVersion!) {
            console.warn(`Trying to refresh invalidated token. userId=${userId}`);
            resolve();
            return;
          }

          resolve(payload);
        });
    });
  });
}
