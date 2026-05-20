/**
 * Dhruv Labs dashboard write-side helpers.
 *
 * These functions log every customer-facing event (chat turn, lead, order paid)
 * into the `dl_*` tables so the dhruv-labs-app dashboard (Org #1: sula-events)
 * has live data to render. Schema lives at db/dhruv_dashboard.sql.
 *
 * All functions are best-effort: if POSTGRES_URL isn't set OR the call throws,
 * we swallow the error and never block the customer flow. Sula's existing
 * email + Moneris paths are unaffected.
 *
 * Per-tenant via env var: each deployment sets DHRUV_ORG_ID (e.g. 'sula-cafe'
 * for sulacafe.com, 'sula-events' for events.sulaindianrestaurant.com).
 */

import { sql } from '@vercel/postgres';

export const DHRUV_ORG_ID = process.env.DHRUV_ORG_ID || 'sula-cafe';

function isDbConfigured(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING);
}

// Self-bootstrap. Runs once per cold start. Idempotent (CREATE IF NOT EXISTS).
let schemaEnsured = false;
async function ensureSchema(): Promise<void> {
  if (schemaEnsured) return;
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_orgs (
        id              TEXT PRIMARY KEY,
        name            TEXT NOT NULL,
        industry        TEXT,
        assistant_name  TEXT,
        owner_name      TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO dl_orgs (id, name, industry, assistant_name, owner_name)
      VALUES ('sula-events', 'Sula Events', 'restaurant', 'Neela', 'Shar')
      ON CONFLICT (id) DO NOTHING
    `;
    // Seed the cafe org. Without this row every sula-cafe write fails the
    // dl_conversations.org_id -> dl_orgs(id) foreign key and nothing reaches
    // the dashboard. Idempotent via ON CONFLICT.
    await sql`
      INSERT INTO dl_orgs (id, name, industry, assistant_name, owner_name)
      VALUES ('sula-cafe', 'Sula Café', 'cafe', 'Chai', 'Shar')
      ON CONFLICT (id) DO NOTHING
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_conversations (
        id                 BIGSERIAL PRIMARY KEY,
        org_id             TEXT NOT NULL REFERENCES dl_orgs(id),
        session_id         TEXT NOT NULL,
        customer_name      TEXT,
        customer_email     TEXT,
        customer_phone     TEXT,
        channel            TEXT NOT NULL DEFAULT 'web',
        status             TEXT NOT NULL DEFAULT 'active',
        message_count      INTEGER NOT NULL DEFAULT 0,
        last_user_msg      TEXT,
        last_assistant_msg TEXT,
        last_message_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (org_id, session_id)
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_conv_org_active_idx ON dl_conversations (org_id, status, last_message_at DESC)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_messages (
        id              BIGSERIAL PRIMARY KEY,
        conversation_id BIGINT NOT NULL REFERENCES dl_conversations(id) ON DELETE CASCADE,
        org_id          TEXT NOT NULL,
        role            TEXT NOT NULL,
        content         TEXT NOT NULL,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_messages_conv_idx ON dl_messages (conversation_id, created_at)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_leads (
        id              BIGSERIAL PRIMARY KEY,
        org_id          TEXT NOT NULL,
        source          TEXT NOT NULL,
        customer_name   TEXT,
        customer_email  TEXT,
        customer_phone  TEXT,
        details         JSONB,
        status          TEXT NOT NULL DEFAULT 'new',
        notes           TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_leads_org_status_idx ON dl_leads (org_id, status, created_at DESC)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dl_events (
        id          BIGSERIAL PRIMARY KEY,
        org_id      TEXT NOT NULL,
        kind        TEXT NOT NULL,
        tag_label   TEXT,
        text        TEXT NOT NULL,
        amount      NUMERIC(10, 2),
        ref_table   TEXT,
        ref_id      TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_events_org_created_idx ON dl_events (org_id, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS dl_events_kind_idx ON dl_events (org_id, kind, created_at DESC)`;
    // dl_attention_queue: things that need an owner tap (modifications, refunds,
    // flagged chats, review-replies awaiting publish). Today.astro's "Needs your
    // tap" panel reads from here. Approve/Reject mutates status + writes a dl_events row.
    await sql`
      CREATE TABLE IF NOT EXISTS dl_attention_queue (
        id              BIGSERIAL PRIMARY KEY,
        org_id          TEXT NOT NULL,
        kind            TEXT NOT NULL,             -- 'modification', 'refund', 'review-reply', 'flagged'
        urgency         TEXT NOT NULL DEFAULT 'normal',  -- 'urgent', 'warm', 'normal'
        icon            TEXT NOT NULL DEFAULT 'briefcase',
        title           TEXT NOT NULL,
        meta            TEXT,
        cta             TEXT NOT NULL DEFAULT 'Review',
        ref_table       TEXT,
        ref_id          TEXT,
        payload         JSONB,                      -- proposed change, new pdf url, etc.
        status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected', 'snoozed'
        resolved_at     TIMESTAMPTZ,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_attention_pending_idx ON dl_attention_queue (org_id, status, created_at DESC)`;
    // dl_calls: one row per Vapi phone call. Webhook /api/vapi-webhook upserts here
    // on every end-of-call-report. Powers the /phone tab in the dashboard.
    await sql`
      CREATE TABLE IF NOT EXISTS dl_calls (
        id                BIGSERIAL PRIMARY KEY,
        org_id            TEXT NOT NULL REFERENCES dl_orgs(id),
        vapi_call_id      TEXT UNIQUE NOT NULL,
        assistant_id      TEXT,
        phone_number_id   TEXT,
        caller_phone      TEXT,
        destination_phone TEXT,
        location_label    TEXT,
        started_at        TIMESTAMPTZ,
        ended_at          TIMESTAMPTZ,
        duration_seconds  INTEGER,
        cost_cents        INTEGER,
        ended_reason      TEXT,
        summary           TEXT,
        intent            TEXT,
        escalation        TEXT,
        needs_followup    BOOLEAN NOT NULL DEFAULT false,
        followup_status   TEXT NOT NULL DEFAULT 'open',
        transcript_text   TEXT,
        transcript_json   JSONB,
        recording_url     TEXT,
        raw_payload       JSONB,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS dl_calls_org_idx ON dl_calls (org_id, started_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS dl_calls_followup_idx ON dl_calls (org_id, needs_followup, followup_status)`;
    schemaEnsured = true;
    console.log('[dhruv_db] schema ensured');
  } catch (err) {
    console.warn('[dhruv_db] ensureSchema failed', err instanceof Error ? err.message : err);
  }
}

// ---------------- Chat persistence ----------------

export interface LogChatArgs {
  sessionId: string;
  channel?: 'web' | 'phone' | 'email' | 'sms';
  userMessage: string;
  assistantReply: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  flagged?: boolean;
}

/**
 * Upserts a conversation row and appends the latest user + assistant turn.
 * Cheap idempotent path: ON CONFLICT bumps message_count + last_message_at.
 */
export async function logChatTurn(args: LogChatArgs): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await ensureSchema();
    const channel = args.channel || 'web';
    const status = args.flagged ? 'flagged' : 'active';
    const userClipped = args.userMessage.slice(0, 4000);
    const assistantClipped = args.assistantReply.slice(0, 4000);

    // Upsert conversation; capture the id either way.
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_conversations (
        org_id, session_id, channel, status,
        customer_name, customer_email, customer_phone,
        message_count, last_user_msg, last_assistant_msg, last_message_at
      ) VALUES (
        ${DHRUV_ORG_ID}, ${args.sessionId}, ${channel}, ${status},
        ${args.customerName ?? null}, ${args.customerEmail ?? null}, ${args.customerPhone ?? null},
        2, ${userClipped}, ${assistantClipped}, NOW()
      )
      ON CONFLICT (org_id, session_id) DO UPDATE SET
        message_count       = dl_conversations.message_count + 2,
        last_user_msg       = EXCLUDED.last_user_msg,
        last_assistant_msg  = EXCLUDED.last_assistant_msg,
        last_message_at     = NOW(),
        status              = CASE WHEN ${args.flagged ?? false} THEN 'flagged' ELSE dl_conversations.status END,
        customer_name       = COALESCE(EXCLUDED.customer_name, dl_conversations.customer_name),
        customer_email      = COALESCE(EXCLUDED.customer_email, dl_conversations.customer_email),
        customer_phone      = COALESCE(EXCLUDED.customer_phone, dl_conversations.customer_phone)
      RETURNING id
    `;
    const conversationId = rows[0]?.id;
    if (!conversationId) return;

    await sql`
      INSERT INTO dl_messages (conversation_id, org_id, role, content)
      VALUES
        (${conversationId}, ${DHRUV_ORG_ID}, 'user', ${userClipped}),
        (${conversationId}, ${DHRUV_ORG_ID}, 'assistant', ${assistantClipped})
    `;

    if (args.flagged) {
      await sql`
        INSERT INTO dl_events (org_id, kind, tag_label, text, ref_table, ref_id)
        VALUES (${DHRUV_ORG_ID}, 'flagged', 'Flag',
                ${'Neela flagged a chat for review: ' + clip(args.userMessage, 140)},
                'dl_conversations', ${String(conversationId)})
      `;
    }
  } catch (err) {
    console.warn('[dhruv_db] logChatTurn failed', err instanceof Error ? err.message : err);
  }
}

// ---------------- Incoming DM persistence (FB/IG webhook) ----------------

export interface LogIncomingDmArgs {
  sessionId: string;                                 // e.g. `facebook-{psid}` or `instagram-{psid}`
  channel: 'facebook' | 'instagram';
  customerName?: string | null;
  text: string;                                       // the message body
  receivedAtMs?: number;                              // epoch ms from the Meta event timestamp
}

/**
 * Single-direction inbound DM ingest. Upserts the conversation, appends ONE
 * dl_messages row with role='user'. (We can append an assistant reply later
 * if/when we wire auto-replies for IG/FB.)
 */
export async function logIncomingDm(args: LogIncomingDmArgs): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await ensureSchema();
    const text = args.text.slice(0, 4000);
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_conversations (
        org_id, session_id, channel, status,
        customer_name, customer_email, customer_phone,
        message_count, last_user_msg, last_assistant_msg, last_message_at
      ) VALUES (
        ${DHRUV_ORG_ID}, ${args.sessionId}, ${args.channel}, 'active',
        ${args.customerName ?? null}, NULL, NULL,
        1, ${text}, NULL, NOW()
      )
      ON CONFLICT (org_id, session_id) DO UPDATE SET
        message_count   = dl_conversations.message_count + 1,
        last_user_msg   = EXCLUDED.last_user_msg,
        last_message_at = NOW(),
        customer_name   = COALESCE(EXCLUDED.customer_name, dl_conversations.customer_name)
      RETURNING id
    `;
    const conversationId = rows[0]?.id;
    if (!conversationId) return;
    await sql`
      INSERT INTO dl_messages (conversation_id, org_id, role, content)
      VALUES (${conversationId}, ${DHRUV_ORG_ID}, 'user', ${text})
    `;
    await sql`
      INSERT INTO dl_events (org_id, kind, tag_label, text, ref_table, ref_id)
      VALUES (${DHRUV_ORG_ID}, 'dm', ${args.channel === 'facebook' ? 'FB DM' : 'IG DM'},
              ${(args.customerName ? `<b>${escape(args.customerName)}</b>` : 'A follower') + ' DMd: ' + clip(text, 120)},
              'dl_conversations', ${String(conversationId)})
    `;
  } catch (err) {
    console.warn('[dhruv_db] logIncomingDm failed', err instanceof Error ? err.message : err);
  }
}

// ---------------- Lead persistence ----------------

export interface LogLeadArgs {
  source: 'quote' | 'groups' | 'catering-order' | 'newsletter' | string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  details?: Record<string, unknown> | null;
  feedText?: string;  // override formatted feed line, otherwise auto-generated
}

export async function logLead(args: LogLeadArgs): Promise<number | null> {
  if (!isDbConfigured()) return null;
  try {
    await ensureSchema();
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_leads (
        org_id, source, customer_name, customer_email, customer_phone, details
      ) VALUES (
        ${DHRUV_ORG_ID}, ${args.source},
        ${args.customerName ?? null}, ${args.customerEmail ?? null}, ${args.customerPhone ?? null},
        ${(args.details ?? {}) as unknown as string}::jsonb
      )
      RETURNING id
    `;
    const leadId = rows[0]?.id;

    const tagLabel = args.source === 'catering-order' ? 'Order'
                   : args.source === 'groups'         ? 'Booking'
                   : 'Lead';
    const who = args.customerName ? `<b>${escape(args.customerName)}</b>` : 'A customer';
    const auto = args.source === 'catering-order'
      ? `${who} requested a catering quote`
      : args.source === 'groups'
      ? `${who} inquired about group dining`
      : `${who} submitted a ${args.source} form`;
    const feedText = args.feedText || auto;

    await sql`
      INSERT INTO dl_events (org_id, kind, tag_label, text, ref_table, ref_id)
      VALUES (${DHRUV_ORG_ID}, ${args.source === 'catering-order' ? 'order' : 'lead'},
              ${tagLabel}, ${feedText},
              'dl_leads', ${leadId ? String(leadId) : null})
    `;
    return leadId || null;
  } catch (err) {
    console.warn('[dhruv_db] logLead failed', err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------------- Lead lookup (for inbound email modifications) ----------------

export interface LeadRow {
  id: number;
  source: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export async function fetchLeadById(id: number): Promise<LeadRow | null> {
  if (!isDbConfigured()) return null;
  try {
    await ensureSchema();
    const { rows } = await sql<LeadRow>`
      SELECT id, source, customer_name, customer_email, customer_phone, details, created_at
        FROM dl_leads
       WHERE id = ${id} AND org_id = ${DHRUV_ORG_ID}
       LIMIT 1
    `;
    return rows[0] || null;
  } catch (err) {
    console.warn('[dhruv_db] fetchLeadById failed', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function fetchLeadByEmail(customerEmail: string): Promise<LeadRow | null> {
  if (!isDbConfigured()) return null;
  try {
    await ensureSchema();
    const { rows } = await sql<LeadRow>`
      SELECT id, source, customer_name, customer_email, customer_phone, details, created_at
        FROM dl_leads
       WHERE org_id = ${DHRUV_ORG_ID}
         AND LOWER(customer_email) = LOWER(${customerEmail})
       ORDER BY created_at DESC
       LIMIT 1
    `;
    return rows[0] || null;
  } catch (err) {
    console.warn('[dhruv_db] fetchLeadByEmail failed', err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------------- Attention queue write ----------------

export interface EnqueueAttentionArgs {
  kind: 'modification' | 'refund' | 'review-reply' | 'flagged';
  urgency?: 'urgent' | 'warm' | 'normal';
  icon?: string;
  title: string;
  meta?: string;
  cta?: string;
  refTable?: string;
  refId?: string;
  payload?: Record<string, unknown>;
}

export async function enqueueAttention(args: EnqueueAttentionArgs): Promise<number | null> {
  if (!isDbConfigured()) return null;
  try {
    await ensureSchema();
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_attention_queue (
        org_id, kind, urgency, icon, title, meta, cta, ref_table, ref_id, payload
      ) VALUES (
        ${DHRUV_ORG_ID}, ${args.kind}, ${args.urgency || 'normal'},
        ${args.icon || 'briefcase'}, ${args.title}, ${args.meta || null},
        ${args.cta || 'Review'}, ${args.refTable || null}, ${args.refId || null},
        ${(args.payload ?? {}) as unknown as string}::jsonb
      )
      RETURNING id
    `;
    return rows[0]?.id || null;
  } catch (err) {
    console.warn('[dhruv_db] enqueueAttention failed', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function resolveAttention(id: number, status: 'approved' | 'rejected' | 'snoozed'): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await sql`
      UPDATE dl_attention_queue
         SET status = ${status},
             resolved_at = NOW()
       WHERE id = ${id} AND org_id = ${DHRUV_ORG_ID}
    `;
  } catch (err) {
    console.warn('[dhruv_db] resolveAttention failed', err instanceof Error ? err.message : err);
  }
}

export async function fetchAttention(id: number): Promise<{ id: number; kind: string; payload: Record<string, unknown> | null; ref_table: string | null; ref_id: string | null; status: string } | null> {
  if (!isDbConfigured()) return null;
  try {
    const { rows } = await sql<{ id: number; kind: string; payload: Record<string, unknown> | null; ref_table: string | null; ref_id: string | null; status: string }>`
      SELECT id, kind, payload, ref_table, ref_id, status
        FROM dl_attention_queue
       WHERE id = ${id} AND org_id = ${DHRUV_ORG_ID}
       LIMIT 1
    `;
    return rows[0] || null;
  } catch (err) {
    console.warn('[dhruv_db] fetchAttention failed', err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------------- Order paid event ----------------

export interface LogPaidArgs {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  amount: number;
  eventTitle?: string;
  qty?: number;
}

export async function logOrderPaid(args: LogPaidArgs): Promise<void> {
  if (!isDbConfigured()) return;
  try {
    await ensureSchema();
    const who = args.customerName ? `<b>${escape(args.customerName)}</b>` : 'A customer';
    const what = args.eventTitle
      ? `paid for ${args.qty ? args.qty + ' x ' : ''}${escape(args.eventTitle)}`
      : `completed payment`;
    await sql`
      INSERT INTO dl_events (org_id, kind, tag_label, text, amount, ref_table, ref_id)
      VALUES (${DHRUV_ORG_ID}, 'paid', 'Paid',
              ${who + ' ' + what + ' ($' + args.amount.toFixed(2) + ')'},
              ${args.amount}, 'events_orders', ${args.orderId})
    `;
  } catch (err) {
    console.warn('[dhruv_db] logOrderPaid failed', err instanceof Error ? err.message : err);
  }
}

// ---------------- Vapi call ingest ----------------

export interface LogCallArgs {
  vapiCallId: string;
  assistantId?: string | null;
  phoneNumberId?: string | null;
  callerPhone?: string | null;
  destinationPhone?: string | null;
  locationLabel?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  durationSeconds?: number | null;
  costCents?: number | null;
  endedReason?: string | null;
  summary?: string | null;
  intent?: string | null;
  escalation?: string | null;
  needsFollowup?: boolean;
  transcriptText?: string | null;
  transcriptJson?: unknown;
  recordingUrl?: string | null;
  rawPayload?: unknown;
}

export async function logCall(args: LogCallArgs): Promise<number | null> {
  if (!isDbConfigured()) return null;
  try {
    await ensureSchema();
    const { rows } = await sql<{ id: number }>`
      INSERT INTO dl_calls (
        org_id, vapi_call_id, assistant_id, phone_number_id,
        caller_phone, destination_phone, location_label,
        started_at, ended_at, duration_seconds, cost_cents,
        ended_reason, summary, intent, escalation, needs_followup,
        transcript_text, transcript_json, recording_url, raw_payload
      ) VALUES (
        ${DHRUV_ORG_ID}, ${args.vapiCallId}, ${args.assistantId ?? null}, ${args.phoneNumberId ?? null},
        ${args.callerPhone ?? null}, ${args.destinationPhone ?? null}, ${args.locationLabel ?? null},
        ${args.startedAt ?? null}, ${args.endedAt ?? null}, ${args.durationSeconds ?? null}, ${args.costCents ?? null},
        ${args.endedReason ?? null}, ${args.summary ?? null}, ${args.intent ?? null}, ${args.escalation ?? null}, ${args.needsFollowup ?? false},
        ${args.transcriptText ?? null}, ${(args.transcriptJson ?? null) as unknown as string}::jsonb,
        ${args.recordingUrl ?? null}, ${(args.rawPayload ?? null) as unknown as string}::jsonb
      )
      ON CONFLICT (vapi_call_id) DO UPDATE SET
        ended_at         = COALESCE(EXCLUDED.ended_at, dl_calls.ended_at),
        duration_seconds = COALESCE(EXCLUDED.duration_seconds, dl_calls.duration_seconds),
        cost_cents       = COALESCE(EXCLUDED.cost_cents, dl_calls.cost_cents),
        ended_reason     = COALESCE(EXCLUDED.ended_reason, dl_calls.ended_reason),
        summary          = COALESCE(EXCLUDED.summary, dl_calls.summary),
        intent           = COALESCE(EXCLUDED.intent, dl_calls.intent),
        escalation       = COALESCE(EXCLUDED.escalation, dl_calls.escalation),
        needs_followup   = EXCLUDED.needs_followup,
        transcript_text  = COALESCE(EXCLUDED.transcript_text, dl_calls.transcript_text),
        transcript_json  = COALESCE(EXCLUDED.transcript_json, dl_calls.transcript_json),
        recording_url    = COALESCE(EXCLUDED.recording_url, dl_calls.recording_url),
        raw_payload      = COALESCE(EXCLUDED.raw_payload, dl_calls.raw_payload)
      RETURNING id
    `;
    const callId = rows[0]?.id ?? null;

    if (callId) {
      const who = args.callerPhone ? `<b>${escape(args.callerPhone)}</b>` : 'A caller';
      const where = args.locationLabel ? ` at ${escape(args.locationLabel)}` : '';
      const intentTxt = args.intent ? ` (${escape(args.intent)})` : '';
      const text = `${who} called Neela${where}${intentTxt}`;
      await sql`
        INSERT INTO dl_events (org_id, kind, tag_label, text, ref_table, ref_id)
        VALUES (${DHRUV_ORG_ID}, 'call', 'Call', ${text}, 'dl_calls', ${String(callId)})
      `;
    }
    return callId;
  } catch (err) {
    console.warn('[dhruv_db] logCall failed', err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------------- helpers ----------------

function clip(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + '…';
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
