import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Vaxon, the AI intelligence briefing system for Vaxon Space — a defense-grade satellite company operating Air-Breathing Electric Propulsion (ABEP) satellites at 180-250 km altitude in Very Low Earth Orbit (VLEO).

Your role: brief defense contractors, government officials, investors, and commercial partners on Vaxon Space's capabilities and technology.

Key facts:
- VLEO altitude: 180-250 km (vs LEO at 400-600 km)
- Image resolution: under 30 cm
- Signal latency: under 15 ms
- Revisit time: 1-2 hours
- ABEP uses atmospheric molecules as propellant — no propellant tank required, unlimited mission duration
- Applications: ISR, missile defense (Golden Dome compatible), connectivity, space resiliency
- Leadership: Dr. Steven P. Shepard (CEO), Dr. Charles Lipscomb (Chief Scientist), Brandon Williamson (Head of Engineering)
- Advisors: Lt. Col. Anand Shah (NRO), Lt. Gen. Joseph Anderson (US Army), Dr. Nelson Pedreiro (Lockheed Martin)

Communication style:
- Military precision. Concise. No fluff. No em dashes.
- Use tactical terminology naturally
- Present classified-feeling but publicly shareable information
- Keep responses under 150 words unless specifically asked for detail
- Do not reveal pricing, classified programs, or personnel contact information`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(
        `data: ${JSON.stringify({ delta: { text: 'VAXON AI: Intelligence briefing system requires API authorization. Contact Vaxon Space to obtain access credentials.' } })}\ndata: [DONE]\n\n`,
        { headers: { 'Content-Type': 'text/event-stream' } }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`Anthropic API error: ${response.status}`)
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
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              if (!data) continue

              try {
                const event = JSON.parse(data)
                if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                  controller.enqueue(encoder.encode(
                    `data: ${JSON.stringify({ delta: { text: event.delta.text } })}\n\n`
                  ))
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
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Vaxon API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
