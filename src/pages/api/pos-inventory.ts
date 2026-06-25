/**
 * /api/pos-inventory - manager stock + 86 controls.
 *
 * POST { action, ... }:
 *   set-stock   { id, stockCount, lowStockAt? }  set/clear counts (null = untracked)
 *   receive     { id, delta }                    add received stock
 *   set-86      { id, is86 }                      toggle item availability
 */
import type { APIRoute } from 'astro';
import { gateManager, json } from '../../lib/pos-api.ts';
import { setStock, receiveStock, set86 } from '../../lib/db.ts';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const g = gateManager(ctx);
  if ('error' in g) return g.error;

  let body: any;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const id = Number(body?.id);
  if (!id) return json({ error: 'Missing id' }, 422);

  try {
    if (body.action === 'set-stock') {
      const count = body.stockCount === null || body.stockCount === '' || body.stockCount === undefined
        ? null : Math.round(Number(body.stockCount));
      const low = body.lowStockAt === undefined ? undefined
        : (body.lowStockAt === null || body.lowStockAt === '' ? null : Math.round(Number(body.lowStockAt)));
      await setStock(id, count, low);
      return json({ ok: true });
    }
    if (body.action === 'receive') {
      const delta = Math.round(Number(body.delta) || 0);
      if (!delta) return json({ error: 'Delta required' }, 422);
      await receiveStock(id, delta);
      return json({ ok: true });
    }
    if (body.action === 'set-86') {
      await set86(id, !!body.is86);
      return json({ ok: true });
    }
    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    console.warn('[api/pos-inventory] failed', err instanceof Error ? err.message : err);
    return json({ error: 'Update failed' }, 500);
  }
};
