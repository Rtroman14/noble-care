"use client"

import { LeaksTable } from "@/components/leaks/leaks-table"
import { PageBody, PageHeader } from "@/components/page-header"
import { useVisibleLeaks } from "@/lib/demo-store"

export function MemberLeaks() {
  const leaks = useVisibleLeaks()
  return (
    <PageBody>
      <PageHeader title="Leak reports" description="Every leak you've reported and how fast Noble responded." />
      <LeaksTable leaks={leaks} />
    </PageBody>
  )
}
