import { client } from '@/sanity/lib/client'
import { NextResponse } from 'next/server'

export const revalidate = 60

export async function GET() {
  try {
    const [news, team] = await Promise.all([
      client.fetch(
        `*[_type == "newsItem"] | order(orderRank asc, _createdAt desc) {
          date, title, body, source, link
        }`
      ),
      client.fetch(
        `*[_type == "teamMember"] | order(orderRank asc) {
          name, role,
          "image": image.asset->url,
          linkedin, creds, isAdvisor
        }`
      ),
    ])
    return NextResponse.json({ news, team })
  } catch (e) {
    console.error('Sanity fetch error:', e)
    return NextResponse.json({ news: [], team: [] })
  }
}
