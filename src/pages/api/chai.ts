import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { logChatTurn, logLead } from '../../lib/dhruv_db.ts';
import {
  CAFE_IDENTITY,
  CAFE_LOCATION,
  CAFE_HOURS,
  CAFE_VIBE,
  CAFE_BUSINESS_SIBLINGS,
  CAFE_POLICIES,
} from '../../lib/chai-cafe.ts';
import { renderMenuForPrompt } from '../../lib/chai-menu.ts';
import { renderFaqsForPrompt } from '../../lib/chai-faq.ts';
import {
  CHAI_HISTORY,
  GROWING_REGIONS,
  SPICE_TRAIL,
  COFFEE_STORY,
  HOME_RECIPE,
  THE_JOURNAL,
} from '../../lib/chai-knowledge.ts';
import { CHAI_PERSONA, CHAI_CONDUCT } from '../../lib/chai-persona.ts';
import crypto from 'node:crypto';

export const prerender = false;

// Complaint / frustration escalation. A matching customer message logs the
// chat turn with flagged = true, surfacing it in the dashboard for a human.
const ESCALATION_PATTERN = /\b(complaint|complain|complained|terrible|awful|disgusting|gross|horrible|worst|rude|refund|manager|unacceptable|angry|furious|upset|disappointed|disappointing|frustrated|frustrating|ridiculous|overcharged|wrong order|cold food|food poisoning|made me sick|never again|never coming back|speak to someone)\b/i;
function isEscalation(text: string): boolean {
  return !!text && ESCALATION_PATTERN.test(text);
}

// The full system prompt. Knowledge lives in src/lib/chai-*.ts, those files are
// the single source of truth. Edit them, not this string.
const SYSTEM_PROMPT = `${CHAI_PERSONA}

ABOUT THE CAFE
${CAFE_IDENTITY}

WHERE WE ARE
${CAFE_LOCATION}

HOURS
${CAFE_HOURS}

THE FEEL
${CAFE_VIBE}

THE SULA FAMILY
${CAFE_BUSINESS_SIBLINGS}

POLICIES
${CAFE_POLICIES}

THE MENU
${renderMenuForPrompt()}

COMMON QUESTIONS
${renderFaqsForPrompt()}

THE STORY OF CHAI
${CHAI_HISTORY}

WHERE IT GROWS
${GROWING_REGIONS}

THE SPICES
${SPICE_TRAIL}

INDIAN COFFEE
${COFFEE_STORY}

MAKING CHAI AT HOME
${HOME_RECIPE}

THE JOURNAL
${THE_JOURNAL}

${CHAI_CONDUCT}

Today's date is ${new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`;

const TOOLS = [
  {
    name: 'capture_lead',
    description:
      "Pass a customer's details to the Sula Cafe team. Use when a customer wants catering or wholesale, wants to leave a message or feedback, or asks something that needs a human to follow up. Only call once you have the customer's name and either an email or a phone number.",
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Customer name' },
        email: { type: 'string', description: 'Customer email, if given' },
        phone: { type: 'string', description: 'Customer phone, if given' },
        reason: {
          type: 'string',
          enum: ['general', 'catering', 'wholesale', 'feedback'],
          description: 'What the inquiry is about',
        },
        message: {
          type: 'string',
          description: 'A short summary of what the customer needs, in their words where possible',
        },
        eventDate: {
          type: 'string',
          description: 'Event or delivery date if the customer mentioned one, otherwise omit',
        },
      },
      required: ['name', 'reason', 'message'],
    },
  },
];

interface ChatMessage { role: 'user' | 'assistant'; content: string; }
interface RequestBody { messages?: ChatMessage[]; sessionId?: string; }

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getSessionId(request: Request, body: RequestBody): string {
  if (body.sessionId && typeof body.sessionId === 'string' && body.sessionId.length < 80) {
    return body.sessionId;
  }
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)chai_sid=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  return 'sc_' + crypto.randomBytes(12).toString('hex');
}

// Tool handler. Writes the lead into the shared dashboard via logLead.
// Returns whether the customer's details were good enough to save.
async function handleCaptureLead(input: Record<string, unknown>, sessionId: string): Promise<boolean> {
  const name = clean(input?.name, 120);
  const email = clean(input?.email, 160);
  const phone = clean(input?.phone, 40);
  const message = clean(input?.message, 4000);
  const eventDate = clean(input?.eventDate, 60);
  let reason = clean(input?.reason, 20).toLowerCase();
  if (!['general', 'catering', 'wholesale', 'feedback'].includes(reason)) reason = 'general';
  if (!name || (!email && !phone)) return false;

  const reasonLabel = reason === 'catering' ? 'a catering inquiry'
    : reason === 'wholesale' ? 'a wholesale inquiry'
    : reason === 'feedback' ? 'feedback'
    : 'a message';
  try {
    await logLead({
      source: reason,
      customerName: name,
      customerEmail: email || null,
      customerPhone: phone || null,
      details: { reason, eventDate: eventDate || null, message, via: 'chai-web-chat', sessionId },
      feedText: `<b>${escapeHtml(name)}</b> left ${reasonLabel} through the Chai web chat`,
    });
    return true;
  } catch (err) {
    console.warn('[api/chai] capture_lead failed', err instanceof Error ? err.message : err);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Chai is taking a quick break, try again in a minute.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (!incoming.length) {
    return new Response(JSON.stringify({ error: 'Empty conversation' }), { status: 400 });
  }

  const sessionId = getSessionId(request, body);
  const lastUserMessage = [...incoming].reverse().find((m) => m.role === 'user')?.content || '';
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Conversation history, growing as tool calls resolve.
  const messages: Anthropic.MessageParam[] = incoming.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let text = '';
  let leadCaptured = false;

  try {
    // Agentic loop: model may call capture_lead, we run it and continue until
    // it returns a normal text reply. Capped so a bad loop cannot run away.
    for (let turn = 0; turn < 4; turn++) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });

      const textParts = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text);

      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });
        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const block of response.content) {
          if (block.type !== 'tool_use') continue;
          if (block.name === 'capture_lead') {
            const ok = await handleCaptureLead(block.input as Record<string, unknown>, sessionId);
            leadCaptured = leadCaptured || ok;
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: ok
                ? 'Lead saved. Tell the customer it has been passed to the team and they will follow up.'
                : 'Could not save it, the name and a contact method are needed. Ask the customer for an email or phone number.',
            });
          } else {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: 'Unknown tool.',
              is_error: true,
            });
          }
        }
        messages.push({ role: 'user', content: toolResults });
        continue;
      }

      text = textParts.join('\n').trim();
      break;
    }

    if (!text) {
      text = 'Sorry, I lost my train of thought there. Mind asking again?';
    }

    // Persist the turn. Must await, Vercel kills the function once the response
    // returns. logChatTurn swallows its own errors so it never blocks the chat.
    await logChatTurn({
      sessionId,
      channel: 'web',
      userMessage: lastUserMessage,
      assistantReply: text,
      flagged: isEscalation(lastUserMessage),
    });

    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append(
      'Set-Cookie',
      `chai_sid=${encodeURIComponent(sessionId)}; Path=/; Max-Age=2592000; SameSite=Lax; Secure; HttpOnly`,
    );
    return new Response(JSON.stringify({ text, leadCaptured }), { headers });
  } catch (err) {
    console.error('[api/chai] error', err);
    return new Response(JSON.stringify({ error: 'Hmm, I tripped on that one. Mind trying again?' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
