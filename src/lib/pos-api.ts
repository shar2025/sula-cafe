/**
 * Shared helpers for the /api/pos-* routes: JSON responses, tenant + role
 * gating. Selling needs any logged-in staff; catalog / inventory / reports /
 * import need a manager. Non-cafe tenants get a flat 404.
 */
import type { APIContext } from 'astro';
import { IS_CAFE, sessionFromCookies, type PosSession } from './access.ts';

export function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

export function notFound(): Response {
  return new Response('Not found', { status: 404 });
}

/** Returns the session if cafe tenant + logged in, else a Response to return. */
export function gateStaff(ctx: APIContext): { session: PosSession } | { error: Response } {
  if (!IS_CAFE) return { error: notFound() };
  const session = sessionFromCookies(ctx.cookies);
  if (!session) return { error: json({ error: 'Not signed in' }, 401) };
  return { session };
}

export function gateManager(ctx: APIContext): { session: PosSession } | { error: Response } {
  const r = gateStaff(ctx);
  if ('error' in r) return r;
  if (r.session.role !== 'manager') return { error: json({ error: 'Manager access required' }, 403) };
  return r;
}
