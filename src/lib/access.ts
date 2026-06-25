/**
 * POS access control: tenant gate + staff session.
 *
 * Tenant gate: the POS is for the cafe tenant ONLY. IS_CAFE is true only when
 * this deployment's DHRUV_ORG_ID is 'sula-cafe'. Every POS page and API calls
 * requireCafe()/gate logic first; for the restaurant ('sula-events') or any
 * studio tenant the POS routes 404 / redirect home and the tab never renders.
 *
 * Auth: staff log in with a PIN at /pos/login. We mint a compact HMAC-signed
 * cookie (no DB session table needed) carrying staff id, name, role. Selling
 * needs any logged-in staff; catalog / inventory / reports need role=manager.
 */

import crypto from 'node:crypto';
import { POS_ORG_ID } from './db.ts';

export const IS_CAFE = POS_ORG_ID === 'sula-cafe';

export const POS_COOKIE = 'pos_session';
const MAX_AGE = 60 * 60 * 12; // 12h shift

function secret(): string {
  return process.env.POS_SESSION_SECRET || process.env.ANTHROPIC_API_KEY || 'sula-cafe-pos-dev-secret';
}

export interface PosSession {
  id: number;
  name: string;
  role: 'staff' | 'manager';
  exp: number;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function mintSession(s: { id: number; name: string; role: 'staff' | 'manager' }): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const body = Buffer.from(JSON.stringify({ ...s, exp })).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifySession(token: string | undefined): PosSession | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString()) as PosSession;
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

/** Astro cookies-like reader: works with Astro.cookies or a raw token. */
export function sessionFromCookies(cookies: { get(name: string): { value: string } | undefined }): PosSession | null {
  return verifySession(cookies.get(POS_COOKIE)?.value);
}

export const SESSION_COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
};
