/**
 * /api/pos-import - manager catalog import / re-seed from src/lib/pos-catalog.ts.
 *
 * POST { overwrite?:boolean }. Idempotent: products + modifier groups upsert by
 * natural key, so re-running never duplicates. overwrite=true also resets seed
 * prices to the catalog defaults (use to pull in a corrected menu file).
 *
 * Phase 2: accept a Toast / CSV export body and map it here.
 */
import type { APIRoute } from 'astro';
import { gateManager, json } from '../../lib/pos-api.ts';
import { seedCatalog } from '../../lib/db.ts';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const g = gateManager(ctx);
  if ('error' in g) return g.error;

  let body: any = {};
  try { body = await ctx.request.json(); } catch { /* allow empty body */ }

  try {
    const result = await seedCatalog(!!body?.overwrite);
    return json({ ok: true, ...result });
  } catch (err) {
    console.warn('[api/pos-import] failed', err instanceof Error ? err.message : err);
    return json({ error: 'Import failed' }, 500);
  }
};
