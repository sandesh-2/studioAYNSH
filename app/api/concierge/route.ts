import { streamText } from 'ai'
import { headers } from 'next/headers'

const SYSTEM_PROMPT = `You are the Studio AYNSH AI Concierge — a refined, elegant assistant for one of India's premier luxury photography studios.

## Studio Information
- **Name:** Studio AYNSH
- **Lead Photographer:** Praveen Gupta
- **Location:** Bhagat Chauraha, Rampur Road, Taramandal, Gorakhpur, Uttar Pradesh 273016, India
- **Phone:** +91 7084019414
- **Email:** samratgupta7754@gmail.com
- **WhatsApp:** https://wa.me/917084019414
- **Tagline:** We Capture The Untold Story

## Services Offered
1. **Wedding Photography** — ₹45,000 to ₹1,20,000+ depending on package
2. **Pre-Wedding Photography** — ₹18,000 to ₹55,000
3. **Portrait Photography** — ₹8,000 to ₹28,000
4. **Fashion Photography** — ₹25,000 to ₹60,000+ (custom production)
5. **Drone Photography** — ₹12,000 to ₹40,000
6. **Commercial Photography** — ₹15,000 to custom

## Your Role
- You can explain services, recommend packages based on client needs, guide clients through the booking process, and answer FAQs.
- You represent a premium, luxury brand. Always respond with warmth, elegance, and refinement.
- **Never invent pricing, policies, or availability.** If you do not know something, say so graciously and direct them to contact the studio directly.
- Keep responses concise but thorough — this is a luxury studio, not a chatbot.
- Always encourage clients to contact or book when appropriate.
- Do not answer questions unrelated to Studio AYNSH or photography.

## Tone
Warm, eloquent, professional. Like a knowledgeable studio concierge, not a generic AI assistant.`

// Simple in-memory rate limiter (per IP, resets per process/cold start)
// For production scale, use Upstash Redis. This covers the majority of abuse cases.
const rateLimitMap = new Map<string, { count: number; windowStart: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000  // 1 minute
const RATE_LIMIT_MAX = 20            // 20 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    return true
  }
  entry.count++
  if (entry.count > RATE_LIMIT_MAX) return false
  return true
}

export async function POST(req: Request) {
  // ── Rate limiting ──────────────────────────────────────────────────────
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    })
  }

  // ── Input validation ───────────────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('messages' in body) ||
    !Array.isArray((body as { messages: unknown }).messages)
  ) {
    return new Response(JSON.stringify({ error: 'Invalid messages format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const rawMessages = (body as { messages: unknown[] }).messages

  // Hard cap on conversation history to prevent context stuffing
  if (rawMessages.length > 40) {
    return new Response(JSON.stringify({ error: 'Conversation too long.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Validate each message shape and sanitize content length
  const messages = rawMessages
    .filter(
      (m): m is { role: string; content: string } =>
        m !== null &&
        typeof m === 'object' &&
        'role' in m &&
        'content' in m &&
        typeof (m as { role: unknown }).role === 'string' &&
        typeof (m as { content: unknown }).content === 'string' &&
        ['user', 'assistant'].includes((m as { role: string }).role),
    )
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.slice(0, 2000), // Hard cap per message to prevent prompt injection
    }))

  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid messages provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Stream response ────────────────────────────────────────────────────
  const result = streamText({
    model: 'openai/gpt-4.1-mini',
    system: SYSTEM_PROMPT,
    messages,
    maxOutputTokens: 600,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
