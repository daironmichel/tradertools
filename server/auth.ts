import crypto from 'crypto';
import config from './config';
import jwt from 'jsonwebtoken';
import { User, Users } from './db';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Maybe } from 'graphql/jsutils/Maybe';

export interface PasswordHashingOptions {
  keyLength: number;
  iterations: number;
  algorithm: string;
}

export async function hashPassword(
  rawPassword: string,
  salt?: string,
  options?: PasswordHashingOptions
): Promise<string> {
  const { algorithm, iterations, keyLength } = options || config.passwordHasher;
  const saltValue = salt || crypto.randomBytes(16).toString('hex');

  const derivedKeyPromise = new Promise<string>((resolve, reject) => {
    let saltedPassword = [saltValue, rawPassword].join('$');
    crypto.pbkdf2(saltedPassword, saltValue, iterations, keyLength, algorithm, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey.toString('hex'));
    });
  });

  const pwdHash = await derivedKeyPromise;

  return [algorithm, iterations, keyLength, saltValue, pwdHash].join('$');
}

export async function compare(rawPassword: string, storedPassword: string): Promise<boolean> {
  const [algorithm, iterations, keyLength, saltValue] = storedPassword.split('$');

  const hashedPassword = await hashPassword(rawPassword, saltValue, {
    keyLength: parseInt(keyLength),
    iterations: parseInt(iterations),
    algorithm,
  });

  return hashedPassword === storedPassword;
}

export interface AccessTokenPayload {
  userId: number;
}

export async function generateAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const expiration = process.env.ACCESS_TOKEN_EXPIRATION || '10m';

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

export async function generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
    const expiration = process.env.REFRESH_TOKEN_EXPIRATION || '30m';

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
      } else if (error instanceof jwt.JsonWebTokenError) {
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
  reply: FastifyReply
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

      Users()
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

export function sendRefreshToken(reply: FastifyReply, refreshToken: string) {
  reply.setCookie('jid', refreshToken, {
    httpOnly: true,
    signed: true,
    path: '/token',
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || '1800'), // 1800 sec == 30 min
  });
}

export type SignedInUser = Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>;
export type UserTokenVersion = Pick<User, 'tokenVersion'>;
export type UserPassword = Pick<User, 'password'>;

export interface AccessInfo {
  user: SignedInUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResult {
  accessInfo?: AccessInfo;
  error?: string;
}

export async function register(userData: Partial<User>, reply?: FastifyReply): Promise<RegisterResult> {
  let user: Maybe<SignedInUser & UserTokenVersion>;
  try {
    const result: (SignedInUser & UserTokenVersion)[] = await Users()
      .insert(userData)
      .returning(['id', 'username', 'firstName', 'lastName', 'tokenVersion']);
    user = result[0];
  } catch (e) {
    if (e.message.toLowerCase().includes('violates unique constraint')) {
      return { error: 'username taken.' };
    } else {
      console.error(e);
      return { error: 'Unable to register new user.' };
    }
  }

  const accessInfo: AccessInfo = {
    user: user,
    accessToken: await generateAccessToken({ userId: user.id }),
    refreshToken: await generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion }),
  };

  if (reply) sendRefreshToken(reply, accessInfo.refreshToken);

  delete user['tokenVersion'];

  return { accessInfo };
}

export async function login(username: string, password: string, reply?: FastifyReply): Promise<AccessInfo | undefined> {
  const user: Maybe<User> = await Users().where({ username: username }).select('*').first();

  if (!user) return;

  const { password: storedPass = '' } = user;
  const valid = await compare(password, storedPass);
  if (!valid) return;

  const accessInfo: AccessInfo = {
    user: user,
    accessToken: await generateAccessToken({ userId: user.id }),
    refreshToken: await generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion }),
  };

  if (reply) sendRefreshToken(reply, accessInfo.refreshToken);

  delete user['password'];
  delete user['tokenVersion'];

  return accessInfo;
}

export function logout(reply?: FastifyReply) {
  reply?.clearCookie('jid');
}
