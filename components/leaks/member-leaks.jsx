"use client"

import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"

import { LeaksTable } from "@/components/leaks/leaks-table"
import { useReportLeak } from "@/components/leaks/report-leak"
import { PageBody, PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { useVisibleLeaks } from "@/lib/demo-store"

export function MemberLeaks() {
  const leaks = useVisibleLeaks()
  const { openReportLeak } = useReportLeak()
  return (
    <PageBody>
      <PageHeader
        title="Leak reports"
        description="Every leak you've reported and how fast Noble responded."
        actions={
          <Button variant="emergency" onClick={() => openReportLeak()}>
            <ExclamationTriangleIcon data-icon="inline-start" />
            Report a leak
          </Button>
        }
      />
      <LeaksTable leaks={leaks} />
    </PageBody>
  )
}
