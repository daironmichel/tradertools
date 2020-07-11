import crypto from 'crypto';
import config from './config';
import jwt from 'jsonwebtoken';
import db from './db/db';
import { UserRecord, User, MaybeUserRecord } from './db';
import { FastifyReply, FastifyRequest } from 'fastify';

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
    const expiration = process.env.REFRESH_TOKEN_EXPIRATION || '10m';

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
    const { authorization } = request.headers;
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
      if (error instanceof jwt.TokenExpiredError) {
        resolve();
        return;
      } else if (error) {
        console.error(error);
        reject(error);
        return;
      }

      const { userId } = (decoded || {}) as any;

      if (typeof userId !== 'number' || userId <= 0) {
        resolve();
        return;
      }

      resolve({ userId });
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
      if (error instanceof jwt.TokenExpiredError) {
        resolve();
        return;
      } else if (error) {
        console.error(error);
        reject(error);
        return;
      }

      const { userId, tokenVersion } = (decoded || {}) as any;

      if (typeof userId !== 'number' || userId <= 0) {
        console.error('Trying to refresh a token with invalid userId value in payload.');
        resolve();
        return;
      }

      if (typeof tokenVersion !== 'number' || tokenVersion < 0) {
        console.error('Trying to refresh a token with invalid tokenVersion value in payload.');
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

          resolve({ userId, tokenVersion });
        });
    });
  });
}

export function sendRefreshToken(reply: FastifyReply<unknown>, refreshToken: string) {
  reply.setCookie('jid', refreshToken, {
    httpOnly: true,
    signed: true,
    path: '/token',
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || '600'), // 60 * 10 (10 minutes)
  });
}

export interface AccessInfo {
  user: UserRecord;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResult {
  accessInfo?: AccessInfo;
  error?: string;
}

export async function register(userData: UserRecord, reply?: FastifyReply<unknown>): Promise<RegisterResult> {
  let user: MaybeUserRecord;
  try {
    const result: UserRecord[] = await db<User>('User')
      .insert(userData)
      .returning(['id', 'username', 'firstName', 'lastName', 'tokenVersion']);
    user = result[0];
  } catch (e) {
    if (e.message.toLowerCase().includes('violates unique constraint')) {
      return { error: 'username taken.' };
    } else console.error(e);
  }

  if (!user) return { error: 'Unable to register new user.' };

  const accessInfo: AccessInfo = {
    user: user,
    accessToken: await getAccessToken(user),
    refreshToken: await getRefreshToken(user),
  };

  if (reply) sendRefreshToken(reply, accessInfo.refreshToken);

  delete user['password'];
  delete user['tokenVersion'];

  return { accessInfo };
}

export async function login(
  username: string,
  password: string,
  reply?: FastifyReply<unknown>
): Promise<AccessInfo | undefined> {
  const user: MaybeUserRecord = await db<User>('User')
    .where({ username: username })
    .select(['id', 'username', 'firstName', 'lastName', 'password', 'tokenVersion'])
    .first();

  if (!user) return;

  const { password: storedPass = '' } = user;
  const valid = await compare(password, storedPass);
  if (!valid) return;

  const accessToken = await getAccessToken(user);
  const refreshToken = await getRefreshToken(user);

  if (reply) sendRefreshToken(reply, refreshToken);

  delete user['password'];
  delete user['tokenVersion'];

  return { user, accessToken, refreshToken };
}

export function logout(reply?: FastifyReply<unknown>) {
  reply?.clearCookie('jid');
}
