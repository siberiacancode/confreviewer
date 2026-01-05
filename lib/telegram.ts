import { Buffer } from 'node:buffer';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_COOKIE = 'conference-reviewer-auth';
export const TELEGRAM_MAX_AGE_MS = ONE_WEEK_MS;

export interface TelegramAuthPayload {
  auth_date: number;
  first_name?: string;
  hash: string;
  id: number;
  last_name?: string;
  photo_url?: string;
  username?: string;
}

export interface AuthUser {
  authDate: number;
  firstName?: string;
  id: number;
  lastName?: string;
  photoUrl?: string;
  username?: string;
}

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const sha256 = async (value: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return crypto.subtle.digest('SHA-256', data);
  }

  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(value).digest().buffer as ArrayBuffer;
};

const signHmacSha256 = async (secret: ArrayBuffer, data: string) => {
  const encoder = new TextEncoder();

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const key = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    return crypto.subtle.sign('HMAC', key, encoder.encode(data));
  }

  const { createHmac } = await import('node:crypto');
  const secretBuffer = Buffer.from(secret);
  const signature = createHmac('sha256', secretBuffer).update(data).digest();
  return signature.buffer as ArrayBuffer;
};

export const buildDataCheckString = (payload: TelegramAuthPayload) =>
  Object.entries(payload)
    .filter(
      ([key, value]) => key !== 'hash' && value !== undefined && value !== null && value !== ''
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

export const checkTelegramAuthorization = async (
  payload: TelegramAuthPayload,
  botToken: string
) => {
  const dataCheckString = buildDataCheckString(payload);
  const secret = await sha256(botToken);
  const signatureBuffer = await signHmacSha256(secret, dataCheckString);
  const signatureHex = toHex(signatureBuffer);

  return {
    valid: signatureHex === payload.hash,
    reason: signatureHex === payload.hash ? null : ('INVALID_HASH' as const)
  };
};

export const toAuthUser = (payload: TelegramAuthPayload): AuthUser => ({
  id: payload.id,
  username: payload.username,
  firstName: payload.first_name,
  lastName: payload.last_name,
  photoUrl: payload.photo_url,
  authDate: payload.auth_date
});
