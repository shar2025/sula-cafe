/**
 * /api/pos-sale - create + void POS orders.
 *
 * POST { lines:[{productId,qty,modifierIds}], tender:'cash'|'card', cashReceivedCents }
 *   -> creates the order (prices + GST recomputed server-side), returns the
 *      saved order with number, totals, change, and a receipt payload.
 * POST { action:'void', orderId, reason } -> manager-only void (restocks).
 *
 * Selling is open to any logged-in cafe staff; voids require a manager.
 */
import type { APIRoute } from 'astro';
import { gateStaff, gateManager, json } from '../../lib/pos-api.ts';
import { createOrder, voidOrder, getSettings, formatCents } from '../../lib/db.ts';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  let body: any;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }

  if (body?.action === 'void') {
    const g = gateManager(ctx);
    if ('error' in g) return g.error;
    const id = Number(body.orderId);
    if (!id) return json({ error: 'Missing orderId' }, 422);
    const ok = await voidOrder(id, typeof body.reason === 'string' ? body.reason.slice(0, 200) : undefined);
    return ok ? json({ ok: true }) : json({ error: 'Order not found or already voided' }, 404);
  }

  const g = gateStaff(ctx);
  if ('error' in g) return g.error;

  const lines = Array.isArray(body?.lines) ? body.lines : [];
  if (!lines.length) return json({ error: 'Cart is empty' }, 422);
  const tender = body?.tender === 'card' ? 'card' : 'cash';
  const cashReceivedCents = typeof body?.cashReceivedCents === 'number' ? Math.round(body.cashReceivedCents) : undefined;

  try {
    const order = await createOrder({
      lines: lines.map((l: any) => ({
        productId: Number(l.productId),
        qty: Number(l.qty) || 1,
        modifierIds: Array.isArray(l.modifierIds) ? l.modifierIds.map(Number) : [],
      })),
      tender,
      cashReceivedCents,
      staffName: g.session.name,
    });
    const settings = await getSettings();
    return json({
      ok: true,
      order,
      receipt: {
        number: order.number,
        businessName: settings.businessName,
        note: settings.receiptNote,
        gstBps: settings.gstBps,
        subtotal: formatCents(order.subtotal_cents),
        tax: formatCents(order.tax_cents),
        total: formatCents(order.total_cents),
        change: order.change_cents != null ? formatCents(order.change_cents) : null,
        staff: order.staff_name,
      },
    });
  } catch (err) {
    console.warn('[api/pos-sale] failed', err instanceof Error ? err.message : err);
    return json({ error: 'Could not record the sale' }, 500);
  }
};
