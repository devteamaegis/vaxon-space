import { NextRequest, NextResponse } from 'next/server'

/* ───────────────────────────────────────────────────────────
   CONFIG — cost and abuse controls
─────────────────────────────────────────────────────────────*/
const MODEL = 'claude-haiku-4-5'   // cheapest tier
const MAX_TOKENS = 300             // hard ceiling on every response
const MAX_INPUT_CHARS = 600        // per-message input cap
const MAX_HISTORY = 6              // only the last few turns are sent

/* Knowledge: everything the assistant is allowed to draw on lives here.
   No database needed at this scale. */
const SYSTEM_PROMPT = `You are Vaxon, the AI briefing assistant for Vaxon Space, a defense-grade satellite company operating Air-Breathing Electric Propulsion (ABEP) satellites at 180 to 250 km altitude in Very Low Earth Orbit (VLEO).

Your role: brief defense contractors, government officials, investors, and commercial partners on Vaxon Space's capabilities and technology, accurately and concisely.

Company facts:
- VLEO altitude: 180 to 250 km, roughly 3x closer to the surface than traditional LEO (400 to 600 km).
- Image resolution: under 30 cm ground sample distance.
- Signal latency: under 15 ms.
- Revisit time: 1 to 2 hours with a small constellation.
- ABEP harvests atmospheric molecules as propellant, so there is no propellant tank and effectively unlimited mission duration. The atmosphere itself becomes the fuel.
- Self-cleaning orbit: at VLEO, atmospheric drag clears debris in weeks rather than decades, improving resiliency.
- Applications and mission profiles: Remote Sensing (ISR), Missile Defense (Golden Dome compatible, hypersonic and intercept tracking), Connectivity (low-latency data links, bus provider for partners), and Space Resiliency.
- Satellite design highlights: oxygen-resistant thrusters (DARPA-backed engine partner), high-efficiency inlet, aerodynamic architecture, and atomic oxygen (AO) resistant coatings.
- Leadership: Dr. Steven P. Shepard (Co-Founder and CEO), Dr. Charles Lipscomb (Co-Founder and Chief Scientist), Brandon Williamson (Co-Founder and Head of Engineering).
- Advisory board: Lt. Gen. Joseph Anderson (US Army), Dr. Nelson Pedreiro (Lockheed Martin), Lt. Col. Anand Shah (USAF, NRO), Dr. Iain Boyd (hypersonics and space plasma physics).
- Headquarters mailing address: Vaxon Space, Inc., 2066 N Capitol Ave #5009, San Jose, CA 95132.
- General contact: route partnership and briefing requests to the contact page or Dr. Shepard.

Rules:
- Answer only questions related to Vaxon Space, VLEO, space technology, defense applications, and adjacent topics. If asked something unrelated, briefly say it is outside your scope and steer back to Vaxon Space.
- Be concise. Keep answers under 120 words unless detail is explicitly requested.
- Use clear, professional language. Do not use em dashes or semicolons.
- Do not invent pricing, classified program details, contract values, or personal contact information. If asked, direct the user to the contact page.
- If you do not know something, say so plainly rather than guessing.`

/* ───────────────────────────────────────────────────────────
   RATE LIMITING — in-memory, per serverless instance.
   No external service or account required. Combined with the
   per-response token cap above and a monthly spend limit set in
   the Anthropic Console, this bounds worst-case cost.
─────────────────────────────────────────────────────────────*/
const PER_IP_PER_MIN = 8
const GLOBAL_PER_DAY = 1500

const memHits = new Map<string, number[]>()
function memAllow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const arr = (memHits.get(key) || []).filter(t => now - t < windowMs)
  if (arr.length >= max) { memHits.set(key, arr); return false }
  arr.push(now); memHits.set(key, arr)
  // light cleanup so the map cannot grow unbounded
  if (memHits.size > 5000) {
    for (const [k, v] of memHits) { if (v.every(t => now - t > windowMs)) memHits.delete(k) }
  }
  return true
}

function sse(text: string) {
  return new Response(
    `data: ${JSON.stringify({ delta: { text } })}\n\ndata: [DONE]\n\n`,
    { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } }
  )
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return sse('VAXON AI is not yet activated. Authorization is pending. Please check back soon.')
    }

    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'anon')

    // ── Rate limit ──
    const dayKey = 'g:' + new Date().toISOString().slice(0, 10)
    if (!memAllow('ip:' + ip, PER_IP_PER_MIN, 60_000)) {
      return sse('You are sending questions too quickly. Please wait a moment and try again.')
    }
    if (!memAllow(dayKey, GLOBAL_PER_DAY, 86_400_000)) {
      return sse("VAXON AI has reached today's query capacity. Please check back tomorrow.")
    }

    // ── Validate + sanitize input ──
    const body = await req.json().catch(() => null)
    const raw = body?.messages
    if (!Array.isArray(raw) || raw.length === 0) return sse('No query received.')

    const clean = (raw as Array<{ role?: unknown; content?: unknown }>)
      .filter(m => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
      .slice(-MAX_HISTORY)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: (m.content as string).slice(0, MAX_INPUT_CHARS) }))

    if (clean.length === 0 || clean[clean.length - 1].role !== 'user') return sse('No query received.')

    // ── Call Anthropic (streaming) ──
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: clean,
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      const detail = await response.text().catch(() => '')
      console.error('Anthropic API error:', response.status, detail.slice(0, 300))
      return sse('VAXON AI is temporarily unavailable. Please try again shortly.')
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            for (const line of chunk.split('\n')) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (!data || data === '[DONE]') continue
              try {
                const event = JSON.parse(data)
                if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: event.delta.text } })}\n\n`))
                } else if (event.type === 'message_stop') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                }
              } catch {}
            }
          }
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
    })
  } catch (err) {
    console.error('Vaxon API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
