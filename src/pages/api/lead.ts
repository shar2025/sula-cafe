/**
 * /api/lead - lead capture for sulacafe.com.
 *
 * Every submission from the LeadForm component (contact, catering, wholesale)
 * posts here. The lead is written to the shared Dhruv Labs dl_leads table via
 * logLead, so it shows up in the Orbit dashboard feed. If RESEND_API_KEY is
 * set the cafe team also gets an email, otherwise that step is skipped quietly.
 *
 * Env vars (optional, email only):
 *   RESEND_API_KEY    enables the email notification
 *   LEAD_TEAM_EMAIL   recipient, defaults to info@sulacafe.com
 *   LEAD_FROM_EMAIL   sender, defaults to Resend's shared onboarding address
 */
import type { APIRoute } from 'astro';
import { logLead } from '../../lib/dhruv_db.ts';

export const prerender = false;

interface LeadBody {
  name?: string;
  email?: string;
  phone?: string;
  reason?: string;
  eventDate?: string;
  message?: string;
  company?: string; // honeypot, must stay empty
}

const VALID_REASONS = ['general', 'catering', 'wholesale', 'feedback'];

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function notifyByEmail(lead: {
  name: string; email: string; phone: string;
  reason: string; eventDate: string; message: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_TEAM_EMAIL || 'info@sulacafe.com';
  const from = process.env.LEAD_FROM_EMAIL || 'Sula Cafe <onboarding@resend.dev>';
  const subjectMap: Record<string, string> = {
    catering: 'New catering inquiry',
    wholesale: 'New wholesale inquiry',
    feedback: 'New feedback',
    general: 'New website inquiry',
  };
  const subject = `${subjectMap[lead.reason] || 'New website inquiry'}, ${lead.name}`;
  const lines = [
    `Reason: ${lead.reason}`,
    `Name: ${lead.name}`,
    lead.email ? `Email: ${lead.email}` : '',
    lead.phone ? `Phone: ${lead.phone}` : '',
    lead.eventDate ? `Event or delivery date: ${lead.eventDate}` : '',
    '',
    lead.message,
  ].filter(Boolean);
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: lead.email || undefined,
        subject,
        text: lines.join('\n'),
      }),
    });
  } catch (err) {
    console.warn('[api/lead] email notify failed', err instanceof Error ? err.message : err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: LeadBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  // Honeypot. Real users never fill a hidden field. Bots do. Pretend success.
  if (clean(body.company, 80)) return json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 4000);
  const eventDate = clean(body.eventDate, 60);
  let reason = clean(body.reason, 20).toLowerCase();
  if (!VALID_REASONS.includes(reason)) reason = 'general';

  if (!name || (!email && !phone) || !message) {
    return json({ error: 'Please add your name, a way to reach you, and a short message.' }, 422);
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'That email address does not look right.' }, 422);
  }

  const reasonLabel = reason === 'catering' ? 'a catering inquiry'
    : reason === 'wholesale' ? 'a wholesale inquiry'
    : reason === 'feedback' ? 'feedback'
    : 'a general inquiry';
  const feedText = `<b>${escapeHtml(name)}</b> sent ${reasonLabel} from the cafe website`;

  await logLead({
    source: reason,
    customerName: name,
    customerEmail: email || null,
    customerPhone: phone || null,
    details: { reason, eventDate: eventDate || null, message },
    feedText,
  });

  await notifyByEmail({ name, email, phone, reason, eventDate, message });

  return json({ ok: true });
};
