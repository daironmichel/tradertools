import crypto from 'crypto';
import config from './config';

export function hashPassword(rawPassword: string, salt?: string): string {
  const { algorithm, iterations, keylen } = config.passwordHasher;
  const saltValue = salt || crypto.randomBytes(16).toString('hex');
  const pwdHash = crypto.pbkdf2Sync(`${salt}${rawPassword}`, saltValue, iterations, keylen, algorithm).toString('hex');
  return `${algorithm}$${iterations}$${keylen}$${saltValue}$${pwdHash}`;
}
