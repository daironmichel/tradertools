import crypto from 'crypto';
import config from './config';

export function hashPassword(rawPassword: string, salt?: string): string {
  const { algorithm, iterations, keylen } = config.passwordHasher;
  const saltValue = salt || crypto.randomBytes(16).toString('hex');
  const pwdHash = crypto
    .pbkdf2Sync([saltValue, rawPassword].join('$'), saltValue, iterations, keylen, algorithm)
    .toString('hex');
  return [algorithm, iterations, keylen, saltValue, pwdHash].join('$');
}

export function compare(rawPassword: string, storedPassword: string): boolean {
  const [algorithm, iterations, keylen, saltValue, pwdHash] = storedPassword.split('$');

  const pwdHashOfRawPassword = crypto
    .pbkdf2Sync([saltValue, rawPassword].join('$'), saltValue, parseInt(iterations), parseInt(keylen), algorithm)
    .toString('hex');

  return pwdHashOfRawPassword === pwdHash;
}
