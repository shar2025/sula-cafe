/**
 * Sula Cafe POS data layer (org-scoped).
 *
 * Every table is prefixed dl_pos_* and every row carries org_id so the POS can
 * coexist with the shared Dhruv Labs dl_* dashboard tables (see dhruv_db.ts).
 * The POS only ever runs for the cafe tenant (DHRUV_ORG_ID === 'sula-cafe');
 * the gate lives in src/lib/access.ts, but db.ts stays org-scoped regardless so
 * nothing leaks across tenants.
 *
 * Money is integer cents everywhere. ensureSchema() is idempotent, self-bumping
 * via SCHEMA_VERSION, and seeds the catalog + a default manager PIN on first run
 * so the register is usable the moment the env has POSTGRES_URL.
 */

import { sql } from '@vercel/postgres';
import crypto from 'node:crypto';
import {
  SEED_PRODUCTS,
  SEED_MODIFIER_GROUPS,
} from './pos-catalog.ts';

export const POS_ORG_ID = process.env.DHRUV_ORG_ID || 'sula-cafe';

/** Bump when the POS schema shape changes so cold starts re-run ensureSchema. */
export const SCHEMA_VERSION = 1;

export function isDbConfigured(): boolean {
  return !!(
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

// ---------------- money + pin helpers ----------------

export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const v = Math.abs(Math.round(cents));
  return `${sign}$${(v / 100).toFixed(2)}`;
}

/** scrypt PIN hash, salt embedded as salt:hash (hex). */
export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pin), salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPinHash(pin: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const test = crypto.scryptSync(String(pin), salt, 32).toString('hex');
    const a = Buffer.from(test, 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---------------- schema ----------------

let schemaEnsured = false;

export async function ensureSchema(): Promise<void> {
  if (schemaEnsured) return;
  if (!isDbConfigured()) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_meta (
        org_id          TEXT PRIMARY KEY,
        schema_version  INTEGER NOT NULL DEFAULT 0,
        seeded          BOOLEAN NOT NULL DEFAULT false,
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_settings (
        org_id        TEXT PRIMARY KEY,
        gst_bps       INTEGER NOT NULL DEFAULT 500,
        business_name TEXT NOT NULL DEFAULT 'Sula Cafe',
        receipt_note  TEXT NOT NULL DEFAULT 'Thank you for visiting Sula Cafe',
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_products (
        id              BIGSERIAL PRIMARY KEY,
        org_id          TEXT NOT NULL,
        name            TEXT NOT NULL,
        category        TEXT NOT NULL,
        price_cents     INTEGER NOT NULL DEFAULT 0,
        taxable         BOOLEAN NOT NULL DEFAULT true,
        active          BOOLEAN NOT NULL DEFAULT true,
        is_favorite     BOOLEAN NOT NULL DEFAULT false,
        sort            INTEGER NOT NULL DEFAULT 0,
        stock_count     INTEGER,
        low_stock_at    INTEGER,
        is_86           BOOLEAN NOT NULL DEFAULT false,
        tags            JSONB NOT NULL DEFAULT '[]'::jsonb,
        price_placeholder BOOLEAN NOT NULL DEFAULT false,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (org_id, name)
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_pos_products_org_idx ON dl_pos_products (org_id, active, category, sort)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_modifier_groups (
        id          BIGSERIAL PRIMARY KEY,
        org_id      TEXT NOT NULL,
        key         TEXT NOT NULL,
        name        TEXT NOT NULL,
        required    BOOLEAN NOT NULL DEFAULT false,
        min_select  INTEGER NOT NULL DEFAULT 0,
        max_select  INTEGER NOT NULL DEFAULT 1,
        sort        INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (org_id, key)
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_modifiers (
        id                BIGSERIAL PRIMARY KEY,
        org_id            TEXT NOT NULL,
        group_id          BIGINT NOT NULL REFERENCES dl_pos_modifier_groups(id) ON DELETE CASCADE,
        name              TEXT NOT NULL,
        price_delta_cents INTEGER NOT NULL DEFAULT 0,
        active            BOOLEAN NOT NULL DEFAULT true,
        sort              INTEGER NOT NULL DEFAULT 0
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_pos_modifiers_group_idx ON dl_pos_modifiers (group_id, sort)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_product_groups (
        org_id      TEXT NOT NULL,
        product_id  BIGINT NOT NULL REFERENCES dl_pos_products(id) ON DELETE CASCADE,
        group_id    BIGINT NOT NULL REFERENCES dl_pos_modifier_groups(id) ON DELETE CASCADE,
        sort        INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (product_id, group_id)
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_orders (
        id                  BIGSERIAL PRIMARY KEY,
        org_id              TEXT NOT NULL,
        number              INTEGER NOT NULL,
        items               JSONB NOT NULL DEFAULT '[]'::jsonb,
        subtotal_cents      INTEGER NOT NULL DEFAULT 0,
        tax_cents           INTEGER NOT NULL DEFAULT 0,
        total_cents         INTEGER NOT NULL DEFAULT 0,
        tender              TEXT NOT NULL DEFAULT 'cash',
        cash_received_cents INTEGER,
        change_cents        INTEGER,
        status              TEXT NOT NULL DEFAULT 'completed',
        staff_name          TEXT,
        void_reason         TEXT,
        voided_at           TIMESTAMPTZ,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_pos_orders_org_created_idx ON dl_pos_orders (org_id, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS dl_pos_orders_status_idx ON dl_pos_orders (org_id, status, created_at DESC)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_pos_staff (
        id          BIGSERIAL PRIMARY KEY,
        org_id      TEXT NOT NULL,
        name        TEXT NOT NULL,
        pin_hash    TEXT NOT NULL,
        role        TEXT NOT NULL DEFAULT 'staff',
        active      BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (org_id, name)
      )
    `;

    await sql`
      INSERT INTO dl_pos_settings (org_id) VALUES (${POS_ORG_ID})
      ON CONFLICT (org_id) DO NOTHING
    `;

    // Seed catalog + default staff once per org.
    const { rows: metaRows } = await sql<{ seeded: boolean }>`
      SELECT seeded FROM dl_pos_meta WHERE org_id = ${POS_ORG_ID} LIMIT 1
    `;
    if (!metaRows.length) {
      await seedCatalog();
      await seedDefaultStaff();
      await sql`
        INSERT INTO dl_pos_meta (org_id, schema_version, seeded)
        VALUES (${POS_ORG_ID}, ${SCHEMA_VERSION}, true)
        ON CONFLICT (org_id) DO UPDATE SET seeded = true, schema_version = ${SCHEMA_VERSION}, updated_at = NOW()
      `;
    } else {
      await sql`
        UPDATE dl_pos_meta SET schema_version = ${SCHEMA_VERSION}, updated_at = NOW()
        WHERE org_id = ${POS_ORG_ID}
      `;
    }

    schemaEnsured = true;
  } catch (err) {
    console.warn('[pos/db] ensureSchema failed', err instanceof Error ? err.message : err);
  }
}

async function seedDefaultStaff(): Promise<void> {
  const managerPin = process.env.POS_MANAGER_PIN || '4321';
  const staffPin = process.env.POS_STAFF_PIN || '1234';
  await sql`
    INSERT INTO dl_pos_staff (org_id, name, pin_hash, role)
    VALUES (${POS_ORG_ID}, ${'Manager'}, ${hashPin(managerPin)}, ${'manager'})
    ON CONFLICT (org_id, name) DO NOTHING
  `;
  await sql`
    INSERT INTO dl_pos_staff (org_id, name, pin_hash, role)
    VALUES (${POS_ORG_ID}, ${'Barista'}, ${hashPin(staffPin)}, ${'staff'})
    ON CONFLICT (org_id, name) DO NOTHING
  `;
}

/**
 * Seed/refresh the catalog from pos-catalog.ts. Idempotent: products and
 * groups upsert by their natural key, so re-running never duplicates. When
 * overwrite is false (default) existing product prices/edits are preserved.
 */
export async function seedCatalog(overwrite = false): Promise<{ products: number; groups: number }> {
  // Modifier groups + their modifiers.
  const groupIdByKey: Record<string, number> = {};
  for (const g of SEED_MODIFIER_GROUPS) {
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_pos_modifier_groups (org_id, key, name, required, min_select, max_select, sort)
      VALUES (${POS_ORG_ID}, ${g.key}, ${g.name}, ${g.required ?? false}, ${g.minSelect ?? 0}, ${g.maxSelect ?? 1}, 0)
      ON CONFLICT (org_id, key) DO UPDATE SET name = EXCLUDED.name, required = EXCLUDED.required,
        min_select = EXCLUDED.min_select, max_select = EXCLUDED.max_select
      RETURNING id
    `;
    const gid = rows[0].id;
    groupIdByKey[g.key] = gid;
    for (const m of g.modifiers) {
      const { rowCount } = await sql`
        SELECT 1 FROM dl_pos_modifiers WHERE group_id = ${gid} AND name = ${m.name} LIMIT 1
      `;
      if (!rowCount) {
        await sql`
          INSERT INTO dl_pos_modifiers (org_id, group_id, name, price_delta_cents, sort)
          VALUES (${POS_ORG_ID}, ${gid}, ${m.name}, ${m.priceDeltaCents}, ${m.sort ?? 0})
        `;
      }
    }
  }

  let productCount = 0;
  for (const p of SEED_PRODUCTS) {
    const tagsJson = JSON.stringify(p.tags ?? []);
    const setPrice = overwrite ? sql`, price_cents = EXCLUDED.price_cents` : sql``;
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_pos_products
        (org_id, name, category, price_cents, taxable, sort, tags, price_placeholder, is_favorite)
      VALUES
        (${POS_ORG_ID}, ${p.name}, ${p.category}, ${p.priceCents}, ${p.taxable ?? true},
         ${p.sort ?? 0}, ${tagsJson}::jsonb, ${p.pricePlaceholder ?? false},
         ${(p.tags ?? []).includes('signature') || (p.tags ?? []).includes('bestseller')})
      ON CONFLICT (org_id, name) DO UPDATE SET
        category = EXCLUDED.category,
        sort = EXCLUDED.sort,
        tags = EXCLUDED.tags
      RETURNING id
    `;
    const pid = rows[0].id;
    productCount++;
    for (const key of p.modifierGroupKeys ?? []) {
      const gid = groupIdByKey[key];
      if (!gid) continue;
      await sql`
        INSERT INTO dl_pos_product_groups (org_id, product_id, group_id, sort)
        VALUES (${POS_ORG_ID}, ${pid}, ${gid}, 0)
        ON CONFLICT (product_id, group_id) DO NOTHING
      `;
    }
  }
  return { products: productCount, groups: SEED_MODIFIER_GROUPS.length };
}

// ---------------- settings ----------------

export interface PosSettings {
  gstBps: number;
  businessName: string;
  receiptNote: string;
}

export async function getSettings(): Promise<PosSettings> {
  await ensureSchema();
  const { rows } = await sql<{ gst_bps: number; business_name: string; receipt_note: string }>`
    SELECT gst_bps, business_name, receipt_note FROM dl_pos_settings WHERE org_id = ${POS_ORG_ID} LIMIT 1
  `;
  const r = rows[0];
  return {
    gstBps: r?.gst_bps ?? 500,
    businessName: r?.business_name ?? 'Sula Cafe',
    receiptNote: r?.receipt_note ?? 'Thank you for visiting Sula Cafe',
  };
}

export async function updateSettings(patch: Partial<PosSettings>): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE dl_pos_settings SET
      gst_bps = COALESCE(${patch.gstBps ?? null}, gst_bps),
      business_name = COALESCE(${patch.businessName ?? null}, business_name),
      receipt_note = COALESCE(${patch.receiptNote ?? null}, receipt_note),
      updated_at = NOW()
    WHERE org_id = ${POS_ORG_ID}
  `;
}

// ---------------- products + modifiers ----------------

export interface ProductRow {
  id: number;
  name: string;
  category: string;
  price_cents: number;
  taxable: boolean;
  active: boolean;
  is_favorite: boolean;
  sort: number;
  stock_count: number | null;
  low_stock_at: number | null;
  is_86: boolean;
  tags: string[];
  price_placeholder: boolean;
}

export interface ModifierRow {
  id: number;
  group_id: number;
  name: string;
  price_delta_cents: number;
  sort: number;
}

export interface ModifierGroupRow {
  id: number;
  key: string;
  name: string;
  required: boolean;
  min_select: number;
  max_select: number;
  modifiers: ModifierRow[];
}

export async function listProducts(opts: { includeInactive?: boolean } = {}): Promise<ProductRow[]> {
  await ensureSchema();
  const { rows } = opts.includeInactive
    ? await sql<ProductRow>`
        SELECT id, name, category, price_cents, taxable, active, is_favorite, sort,
               stock_count, low_stock_at, is_86, tags, price_placeholder
          FROM dl_pos_products WHERE org_id = ${POS_ORG_ID}
         ORDER BY category, sort, name`
    : await sql<ProductRow>`
        SELECT id, name, category, price_cents, taxable, active, is_favorite, sort,
               stock_count, low_stock_at, is_86, tags, price_placeholder
          FROM dl_pos_products WHERE org_id = ${POS_ORG_ID} AND active = true
         ORDER BY category, sort, name`;
  return rows;
}

export async function listModifierGroups(): Promise<ModifierGroupRow[]> {
  await ensureSchema();
  const { rows: groups } = await sql<Omit<ModifierGroupRow, 'modifiers'>>`
    SELECT id, key, name, required, min_select, max_select
      FROM dl_pos_modifier_groups WHERE org_id = ${POS_ORG_ID} ORDER BY sort, name
  `;
  const { rows: mods } = await sql<ModifierRow>`
    SELECT id, group_id, name, price_delta_cents, sort
      FROM dl_pos_modifiers WHERE org_id = ${POS_ORG_ID} AND active = true ORDER BY sort, name
  `;
  return groups.map((g) => ({ ...g, modifiers: mods.filter((m) => m.group_id === g.id) }));
}

/** product_id -> [group_id] attachment map. */
export async function listProductGroupLinks(): Promise<Record<number, number[]>> {
  await ensureSchema();
  const { rows } = await sql<{ product_id: number; group_id: number }>`
    SELECT product_id, group_id FROM dl_pos_product_groups WHERE org_id = ${POS_ORG_ID} ORDER BY sort
  `;
  const out: Record<number, number[]> = {};
  for (const r of rows) (out[r.product_id] ||= []).push(r.group_id);
  return out;
}

export interface ProductInput {
  name: string;
  category: string;
  priceCents: number;
  taxable?: boolean;
  active?: boolean;
  isFavorite?: boolean;
  sort?: number;
  stockCount?: number | null;
  lowStockAt?: number | null;
  tags?: string[];
  modifierGroupIds?: number[];
}

export async function upsertProduct(input: ProductInput, id?: number): Promise<number> {
  await ensureSchema();
  let productId = id;
  if (productId) {
    await sql`
      UPDATE dl_pos_products SET
        name = ${input.name}, category = ${input.category}, price_cents = ${input.priceCents},
        taxable = ${input.taxable ?? true}, active = ${input.active ?? true},
        is_favorite = ${input.isFavorite ?? false}, sort = ${input.sort ?? 0},
        stock_count = ${input.stockCount ?? null}, low_stock_at = ${input.lowStockAt ?? null},
        tags = ${JSON.stringify(input.tags ?? [])}::jsonb,
        price_placeholder = false, updated_at = NOW()
      WHERE id = ${productId} AND org_id = ${POS_ORG_ID}
    `;
  } else {
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_pos_products
        (org_id, name, category, price_cents, taxable, active, is_favorite, sort, stock_count, low_stock_at, tags)
      VALUES
        (${POS_ORG_ID}, ${input.name}, ${input.category}, ${input.priceCents}, ${input.taxable ?? true},
         ${input.active ?? true}, ${input.isFavorite ?? false}, ${input.sort ?? 0},
         ${input.stockCount ?? null}, ${input.lowStockAt ?? null}, ${JSON.stringify(input.tags ?? [])}::jsonb)
      ON CONFLICT (org_id, name) DO UPDATE SET
        category = EXCLUDED.category, price_cents = EXCLUDED.price_cents, updated_at = NOW()
      RETURNING id
    `;
    productId = rows[0].id;
  }
  if (input.modifierGroupIds) {
    await sql`DELETE FROM dl_pos_product_groups WHERE product_id = ${productId} AND org_id = ${POS_ORG_ID}`;
    for (const gid of input.modifierGroupIds) {
      await sql`
        INSERT INTO dl_pos_product_groups (org_id, product_id, group_id, sort)
        VALUES (${POS_ORG_ID}, ${productId}, ${gid}, 0)
        ON CONFLICT (product_id, group_id) DO NOTHING
      `;
    }
  }
  return productId!;
}

export async function setProductActive(id: number, active: boolean): Promise<void> {
  await ensureSchema();
  await sql`UPDATE dl_pos_products SET active = ${active}, updated_at = NOW() WHERE id = ${id} AND org_id = ${POS_ORG_ID}`;
}

export async function set86(id: number, is86: boolean): Promise<void> {
  await ensureSchema();
  await sql`UPDATE dl_pos_products SET is_86 = ${is86}, updated_at = NOW() WHERE id = ${id} AND org_id = ${POS_ORG_ID}`;
}

export async function setStock(id: number, count: number | null, lowStockAt?: number | null): Promise<void> {
  await ensureSchema();
  if (lowStockAt === undefined) {
    await sql`UPDATE dl_pos_products SET stock_count = ${count}, updated_at = NOW() WHERE id = ${id} AND org_id = ${POS_ORG_ID}`;
  } else {
    await sql`UPDATE dl_pos_products SET stock_count = ${count}, low_stock_at = ${lowStockAt}, updated_at = NOW() WHERE id = ${id} AND org_id = ${POS_ORG_ID}`;
  }
}

export async function receiveStock(id: number, delta: number): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE dl_pos_products
       SET stock_count = COALESCE(stock_count, 0) + ${delta}, updated_at = NOW()
     WHERE id = ${id} AND org_id = ${POS_ORG_ID}
  `;
}

// ---------------- modifier group CRUD ----------------

export async function upsertModifierGroup(input: {
  key: string; name: string; required?: boolean; minSelect?: number; maxSelect?: number;
  modifiers: { name: string; priceDeltaCents: number }[];
}, id?: number): Promise<number> {
  await ensureSchema();
  let gid = id;
  if (gid) {
    await sql`
      UPDATE dl_pos_modifier_groups SET name = ${input.name}, required = ${input.required ?? false},
        min_select = ${input.minSelect ?? 0}, max_select = ${input.maxSelect ?? 1}
      WHERE id = ${gid} AND org_id = ${POS_ORG_ID}
    `;
  } else {
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_pos_modifier_groups (org_id, key, name, required, min_select, max_select)
      VALUES (${POS_ORG_ID}, ${input.key}, ${input.name}, ${input.required ?? false}, ${input.minSelect ?? 0}, ${input.maxSelect ?? 1})
      ON CONFLICT (org_id, key) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;
    gid = rows[0].id;
  }
  // Replace modifiers wholesale.
  await sql`DELETE FROM dl_pos_modifiers WHERE group_id = ${gid} AND org_id = ${POS_ORG_ID}`;
  let i = 0;
  for (const m of input.modifiers) {
    await sql`
      INSERT INTO dl_pos_modifiers (org_id, group_id, name, price_delta_cents, sort)
      VALUES (${POS_ORG_ID}, ${gid}, ${m.name}, ${m.priceDeltaCents}, ${i++})
    `;
  }
  return gid!;
}

export async function deleteModifierGroup(id: number): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM dl_pos_modifier_groups WHERE id = ${id} AND org_id = ${POS_ORG_ID}`;
}

// ---------------- orders ----------------

export interface OrderLineInput {
  productId: number;
  qty: number;
  modifierIds?: number[];
}

export interface OrderLine {
  productId: number;
  name: string;
  qty: number;
  unitBaseCents: number;
  modifiers: { id: number; name: string; priceDeltaCents: number }[];
  unitCents: number;
  lineCents: number;
  taxable: boolean;
}

export interface CreateOrderInput {
  lines: OrderLineInput[];
  tender: 'cash' | 'card';
  cashReceivedCents?: number;
  staffName?: string;
}

export interface OrderRow {
  id: number;
  number: number;
  items: OrderLine[];
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  tender: string;
  cash_received_cents: number | null;
  change_cents: number | null;
  status: string;
  staff_name: string | null;
  created_at: string;
}

/**
 * Creates an order. Prices and tax are recomputed server-side from the DB
 * (never trust client cents), stock is decremented for tracked products, and
 * a feed event is written to dl_events so the order shows in the Orbit
 * dashboard. Returns the saved order.
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderRow> {
  await ensureSchema();
  const settings = await getSettings();

  const productIds = [...new Set(input.lines.map((l) => l.productId))];
  if (!productIds.length) throw new Error('empty order');
  const { rows: products } = await sql<ProductRow>`
    SELECT id, name, category, price_cents, taxable, active, is_favorite, sort,
           stock_count, low_stock_at, is_86, tags, price_placeholder
      FROM dl_pos_products WHERE org_id = ${POS_ORG_ID} AND id = ANY(${productIds as unknown as string})
  `;
  const productById = new Map(products.map((p) => [p.id, p]));

  const { rows: allMods } = await sql<ModifierRow>`
    SELECT id, group_id, name, price_delta_cents, sort FROM dl_pos_modifiers WHERE org_id = ${POS_ORG_ID}
  `;
  const modById = new Map(allMods.map((m) => [m.id, m]));

  const items: OrderLine[] = [];
  let subtotal = 0;
  let tax = 0;
  for (const line of input.lines) {
    const p = productById.get(line.productId);
    if (!p) continue;
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty || 1)));
    const mods = (line.modifierIds || [])
      .map((mid) => modById.get(mid))
      .filter((m): m is ModifierRow => !!m)
      .map((m) => ({ id: m.id, name: m.name, priceDeltaCents: m.price_delta_cents }));
    const modDelta = mods.reduce((s, m) => s + m.priceDeltaCents, 0);
    const unitCents = p.price_cents + modDelta;
    const lineCents = unitCents * qty;
    subtotal += lineCents;
    if (p.taxable) tax += Math.round(lineCents * settings.gstBps / 10000);
    items.push({
      productId: p.id,
      name: p.name,
      qty,
      unitBaseCents: p.price_cents,
      modifiers: mods,
      unitCents,
      lineCents,
      taxable: p.taxable,
    });
  }
  if (!items.length) throw new Error('no valid items');

  const total = subtotal + tax;
  const tender = input.tender === 'card' ? 'card' : 'cash';
  const cashReceived = tender === 'cash' ? (input.cashReceivedCents ?? total) : null;
  const change = tender === 'cash' && cashReceived != null ? Math.max(0, cashReceived - total) : null;

  const { rows: numRows } = await sql<{ next: number }>`
    SELECT COALESCE(MAX(number), 0) + 1 AS next FROM dl_pos_orders
     WHERE org_id = ${POS_ORG_ID} AND created_at::date = (NOW() AT TIME ZONE 'America/Vancouver')::date
  `;
  const number = numRows[0]?.next ?? 1;

  const { rows } = await sql<OrderRow>`
    INSERT INTO dl_pos_orders
      (org_id, number, items, subtotal_cents, tax_cents, total_cents, tender, cash_received_cents, change_cents, status, staff_name)
    VALUES
      (${POS_ORG_ID}, ${number}, ${JSON.stringify(items)}::jsonb, ${subtotal}, ${tax}, ${total},
       ${tender}, ${cashReceived}, ${change}, 'completed', ${input.staffName ?? null})
    RETURNING id, number, items, subtotal_cents, tax_cents, total_cents, tender,
              cash_received_cents, change_cents, status, staff_name, created_at
  `;
  const order = rows[0];

  // Decrement stock for tracked products.
  for (const it of items) {
    await sql`
      UPDATE dl_pos_products
         SET stock_count = stock_count - ${it.qty}, updated_at = NOW()
       WHERE id = ${it.productId} AND org_id = ${POS_ORG_ID} AND stock_count IS NOT NULL
    `;
  }

  // Mirror into the shared dashboard feed (best effort).
  try {
    const count = items.reduce((s, i) => s + i.qty, 0);
    await sql`
      INSERT INTO dl_events (org_id, kind, tag_label, text, amount, ref_table, ref_id)
      VALUES (${POS_ORG_ID}, 'paid', 'Sale',
              ${`POS sale #${number}: ${count} item${count === 1 ? '' : 's'} (${tender})`},
              ${total / 100}, 'dl_pos_orders', ${String(order.id)})
    `;
  } catch {
    /* dl_events may not exist if dashboard side never ran; ignore. */
  }

  return order;
}

export async function voidOrder(id: number, reason?: string): Promise<boolean> {
  await ensureSchema();
  const { rows } = await sql<{ items: OrderLine[]; status: string }>`
    SELECT items, status FROM dl_pos_orders WHERE id = ${id} AND org_id = ${POS_ORG_ID} LIMIT 1
  `;
  const o = rows[0];
  if (!o || o.status === 'voided') return false;
  await sql`
    UPDATE dl_pos_orders SET status = 'voided', void_reason = ${reason ?? null}, voided_at = NOW()
    WHERE id = ${id} AND org_id = ${POS_ORG_ID}
  `;
  // Restock.
  for (const it of o.items || []) {
    await sql`
      UPDATE dl_pos_products SET stock_count = stock_count + ${it.qty}, updated_at = NOW()
      WHERE id = ${it.productId} AND org_id = ${POS_ORG_ID} AND stock_count IS NOT NULL
    `;
  }
  return true;
}

export async function listOrders(opts: { from?: string; to?: string; limit?: number } = {}): Promise<OrderRow[]> {
  await ensureSchema();
  const from = opts.from || '1970-01-01';
  const to = opts.to || '2999-12-31';
  const limit = Math.min(2000, opts.limit || 500);
  const { rows } = await sql<OrderRow>`
    SELECT id, number, items, subtotal_cents, tax_cents, total_cents, tender,
           cash_received_cents, change_cents, status, staff_name, created_at
      FROM dl_pos_orders
     WHERE org_id = ${POS_ORG_ID}
       AND (created_at AT TIME ZONE 'America/Vancouver')::date >= ${from}::date
       AND (created_at AT TIME ZONE 'America/Vancouver')::date <= ${to}::date
     ORDER BY created_at DESC
     LIMIT ${limit}
  `;
  return rows;
}

export interface SalesSummary {
  orderCount: number;
  grossCents: number;       // completed subtotal + tax
  subtotalCents: number;
  taxCents: number;
  cashCents: number;
  cardCents: number;
  voidedCount: number;
  voidedCents: number;
  byItem: { name: string; qty: number; cents: number }[];
  byCategory: { category: string; qty: number; cents: number }[];
  byTender: { tender: string; count: number; cents: number }[];
  cashDrawer: { expectedCashCents: number };
}

export async function salesSummary(from: string, to: string): Promise<SalesSummary> {
  const orders = await listOrders({ from, to, limit: 2000 });
  const completed = orders.filter((o) => o.status === 'completed');
  const voided = orders.filter((o) => o.status === 'voided');

  let subtotal = 0, taxC = 0, cash = 0, card = 0;
  const itemMap = new Map<string, { qty: number; cents: number }>();
  const catMap = new Map<string, { qty: number; cents: number }>();
  const prodCat = new Map<number, string>();
  for (const p of await listProducts({ includeInactive: true })) prodCat.set(p.id, p.category);

  for (const o of completed) {
    subtotal += o.subtotal_cents;
    taxC += o.tax_cents;
    if (o.tender === 'cash') cash += o.total_cents;
    else card += o.total_cents;
    for (const it of o.items || []) {
      const im = itemMap.get(it.name) || { qty: 0, cents: 0 };
      im.qty += it.qty; im.cents += it.lineCents; itemMap.set(it.name, im);
      const cat = prodCat.get(it.productId) || 'Other';
      const cm = catMap.get(cat) || { qty: 0, cents: 0 };
      cm.qty += it.qty; cm.cents += it.lineCents; catMap.set(cat, cm);
    }
  }

  return {
    orderCount: completed.length,
    grossCents: subtotal + taxC,
    subtotalCents: subtotal,
    taxCents: taxC,
    cashCents: cash,
    cardCents: card,
    voidedCount: voided.length,
    voidedCents: voided.reduce((s, o) => s + o.total_cents, 0),
    byItem: [...itemMap.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.cents - a.cents),
    byCategory: [...catMap.entries()].map(([category, v]) => ({ category, ...v })).sort((a, b) => b.cents - a.cents),
    byTender: [
      { tender: 'cash', count: completed.filter((o) => o.tender === 'cash').length, cents: cash },
      { tender: 'card', count: completed.filter((o) => o.tender === 'card').length, cents: card },
    ],
    cashDrawer: { expectedCashCents: cash },
  };
}

// ---------------- staff ----------------

export interface StaffRow {
  id: number;
  name: string;
  role: 'staff' | 'manager';
  active: boolean;
}

export async function listStaff(): Promise<StaffRow[]> {
  await ensureSchema();
  const { rows } = await sql<StaffRow>`
    SELECT id, name, role, active FROM dl_pos_staff WHERE org_id = ${POS_ORG_ID} ORDER BY role DESC, name
  `;
  return rows;
}

export async function findStaffByPin(pin: string): Promise<StaffRow | null> {
  await ensureSchema();
  const { rows } = await sql<StaffRow & { pin_hash: string }>`
    SELECT id, name, role, active, pin_hash FROM dl_pos_staff
     WHERE org_id = ${POS_ORG_ID} AND active = true
  `;
  for (const r of rows) {
    if (verifyPinHash(pin, r.pin_hash)) {
      return { id: r.id, name: r.name, role: r.role, active: r.active };
    }
  }
  return null;
}

export async function getStaff(id: number): Promise<StaffRow | null> {
  await ensureSchema();
  const { rows } = await sql<StaffRow>`
    SELECT id, name, role, active FROM dl_pos_staff WHERE id = ${id} AND org_id = ${POS_ORG_ID} LIMIT 1
  `;
  return rows[0] || null;
}
