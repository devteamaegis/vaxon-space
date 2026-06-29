'use client'
import { useEffect, useState } from 'react'
import { StarField, Nav, TeamSection, InvestorsSection, PartnersSection, LogosSection, Footer, TeamMember, CORE_TEAM, ADVISORS, VX_GLOBAL_STYLE } from '../page'

export default function TeamPage() {
  const [cmsCoreTeam, setCmsCoreTeam] = useState<TeamMember[] | null>(null)
  const [cmsAdvisors, setCmsAdvisors] = useState<TeamMember[] | null>(null)

  useEffect(() => {
    fetch('/api/cms').then(r => r.json()).then(d => {
      if (d.team?.length) {
        setCmsCoreTeam(d.team.filter((m: TeamMember) => !m.isAdvisor))
        setCmsAdvisors(d.team.filter((m: TeamMember) => m.isAdvisor))
      }
    }).catch(() => {})
  }, [])

  const core     = cmsCoreTeam ?? CORE_TEAM
  const advisors = cmsAdvisors ?? ADVISORS

  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="team" />
      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
        <TeamSection core={core} advisors={advisors} />
        <LogosSection />
        <InvestorsSection />
        <PartnersSection />
        <Footer />
      </div>
    </>
  )
}
