/**
 * /api/pos-product - manager catalog CRUD (products + modifier groups + settings).
 *
 * POST body { action, ... }:
 *   save-product   { product:{id?,name,category,priceCents,taxable,active,isFavorite,sort,
 *                              stockCount,lowStockAt,tags,modifierGroupIds} }
 *   set-active     { id, active }
 *   save-group     { group:{id?,key,name,required,minSelect,maxSelect,modifiers:[{name,priceDeltaCents}]} }
 *   delete-group   { id }
 *   save-settings  { gstBps?, businessName?, receiptNote? }
 */
import type { APIRoute } from 'astro';
import { gateManager, json } from '../../lib/pos-api.ts';
import {
  upsertProduct, setProductActive, upsertModifierGroup, deleteModifierGroup, updateSettings,
} from '../../lib/db.ts';

export const prerender = false;

function slug(s: string): string {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'group';
}

export const POST: APIRoute = async (ctx) => {
  const g = gateManager(ctx);
  if ('error' in g) return g.error;

  let body: any;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const action = body?.action;

  try {
    if (action === 'save-product') {
      const p = body.product || {};
      const name = String(p.name || '').trim().slice(0, 120);
      if (!name) return json({ error: 'Name required' }, 422);
      const priceCents = Math.max(0, Math.round(Number(p.priceCents) || 0));
      const id = await upsertProduct({
        name,
        category: String(p.category || 'Other').slice(0, 60),
        priceCents,
        taxable: p.taxable !== false,
        active: p.active !== false,
        isFavorite: !!p.isFavorite,
        sort: Number(p.sort) || 0,
        stockCount: p.stockCount === null || p.stockCount === undefined || p.stockCount === '' ? null : Math.round(Number(p.stockCount)),
        lowStockAt: p.lowStockAt === null || p.lowStockAt === undefined || p.lowStockAt === '' ? null : Math.round(Number(p.lowStockAt)),
        tags: Array.isArray(p.tags) ? p.tags.slice(0, 12).map((t: any) => String(t).slice(0, 30)) : [],
        modifierGroupIds: Array.isArray(p.modifierGroupIds) ? p.modifierGroupIds.map(Number) : undefined,
      }, p.id ? Number(p.id) : undefined);
      return json({ ok: true, id });
    }

    if (action === 'set-active') {
      await setProductActive(Number(body.id), body.active !== false);
      return json({ ok: true });
    }

    if (action === 'save-group') {
      const grp = body.group || {};
      const name = String(grp.name || '').trim().slice(0, 60);
      if (!name) return json({ error: 'Group name required' }, 422);
      const id = await upsertModifierGroup({
        key: grp.key ? slug(grp.key) : slug(name),
        name,
        required: !!grp.required,
        minSelect: Number(grp.minSelect) || 0,
        maxSelect: Number(grp.maxSelect) || 1,
        modifiers: (Array.isArray(grp.modifiers) ? grp.modifiers : [])
          .map((m: any) => ({ name: String(m.name || '').slice(0, 60), priceDeltaCents: Math.round(Number(m.priceDeltaCents) || 0) }))
          .filter((m: any) => m.name),
      }, grp.id ? Number(grp.id) : undefined);
      return json({ ok: true, id });
    }

    if (action === 'delete-group') {
      await deleteModifierGroup(Number(body.id));
      return json({ ok: true });
    }

    if (action === 'save-settings') {
      await updateSettings({
        gstBps: body.gstBps != null ? Math.max(0, Math.min(2000, Math.round(Number(body.gstBps)))) : undefined,
        businessName: typeof body.businessName === 'string' ? body.businessName.slice(0, 80) : undefined,
        receiptNote: typeof body.receiptNote === 'string' ? body.receiptNote.slice(0, 200) : undefined,
      });
      return json({ ok: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    console.warn('[api/pos-product] failed', err instanceof Error ? err.message : err);
    return json({ error: 'Save failed' }, 500);
  }
};
