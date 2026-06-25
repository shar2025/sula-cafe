/**
 * /api/pos-auth - staff PIN login + logout for the cafe POS.
 *
 * Accepts both urlencoded form posts (the login + logout buttons) and JSON.
 * On login success mints an HMAC-signed pos_session cookie and redirects to
 * /pos/. Non-cafe tenants 404. Default seeded PINs live in db.ts (manager 4321,
 * barista 1234) and should be overridden via POS_MANAGER_PIN / POS_STAFF_PIN.
 */
import type { APIRoute } from 'astro';
import { IS_CAFE, mintSession, SESSION_COOKIE_OPTS, POS_COOKIE } from '../../lib/access.ts';
import { findStaffByPin } from '../../lib/db.ts';

export const prerender = false;

async function readBody(request: Request): Promise<Record<string, string>> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return await request.json(); } catch { return {}; }
  }
  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) out[k] = String(v);
  return out;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!IS_CAFE) return new Response('Not found', { status: 404 });
  const body = await readBody(request);

  if (body.action === 'logout') {
    cookies.delete(POS_COOKIE, { path: '/' });
    return redirect('/pos/login', 303);
  }

  const pin = String(body.pin || '').trim();
  if (!pin) return redirect('/pos/login?e=1', 303);

  const staff = await findStaffByPin(pin);
  if (!staff) return redirect('/pos/login?e=1', 303);

  cookies.set(POS_COOKIE, mintSession(staff), SESSION_COOKIE_OPTS);
  const next = body.next && body.next.startsWith('/pos') ? body.next : '/pos/';
  return redirect(next, 303);
};
