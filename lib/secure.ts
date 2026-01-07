import { Buffer } from 'node:buffer';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import process from 'node:process';

const ENCRYPTION_ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const CRYPTO_SECRET = process.env.CRYPTO_SECRET!;

if (!CRYPTO_SECRET) throw new Error('CRYPTO_SECRET is not set');

const deriveKey = () => createHash('sha256').update(CRYPTO_SECRET).digest();

export const encryptPayload = (payload: unknown) => {
  const key = deriveKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ENCRYPTION_ALGO, key, iv);
  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
};

export const decryptPayload = <Data>(raw: string) => {
  const buffer = Buffer.from(raw, 'base64');
  if (buffer.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) return;

  const iv = buffer.subarray(0, IV_LENGTH);
  const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const key = deriveKey();
  const decipher = createDecipheriv(ENCRYPTION_ALGO, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8')) as Data;
};
