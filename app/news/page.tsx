'use client'
import { useEffect, useState } from 'react'
import { StarField, Nav, NewsSection, NewsItem, NEWS, VX_GLOBAL_STYLE } from '../page'

export default function NewsPage() {
  const [cmsNews, setCmsNews] = useState<NewsItem[] | null>(null)

  useEffect(() => {
    fetch('/api/cms').then(r => r.json()).then(d => {
      if (d.news?.length) setCmsNews(d.news)
    }).catch(() => {})
  }, [])

  const news = cmsNews ?? NEWS

  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="news" />
      <div style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <NewsSection news={news} />
      </div>
    </>
  )
}
