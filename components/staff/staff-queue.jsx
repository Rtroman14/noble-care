"use client"

import Link from "next/link"
import { CheckCircleIcon, ClockIcon, CloudIcon, InboxIcon, TruckIcon } from "@heroicons/react/24/outline"

import { LeaksTable } from "@/components/leaks/leaks-table"
import { PageBody, PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useNow } from "@/hooks/use-now"
import { useDemoStore } from "@/lib/demo-store"
import { formatDateTime } from "@/lib/format"
import { isLeakOpen, leakSla } from "@/lib/leaks"
import { getBuilding } from "@/lib/mock/buildings"
import { getPlan } from "@/lib/mock/plans"

export function StaffQueue() {
  const { leaks, storms, stormAlerts } = useDemoStore()
  const now = useNow(15_000)
  const open = leaks.filter(isLeakOpen)
  const overdue = open.filter((l) => leakSla(l, getPlan(getBuilding(l.buildingId).tier).responseHours, now).overdue)
  const storm = storms[0]
  const stormSent = stormAlerts.some((a) => a.stormId === storm?.id)

  return (
    <PageBody>
      <PageHeader title="Request queue" description="Leak reports from every RAMP member, newest first." />
      {storm && !stormSent && (
        <Alert variant="warning">
          <CloudIcon />
          <AlertTitle>{storm.name} is approaching</AlertTitle>
          <AlertDescription>Landfall expected {formatDateTime(storm.landfallAt)}. Member buildings are in the forecast cone.</AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline" render={<Link href="/staff/storms" />} nativeButton={false}>
              Open storm center
            </Button>
          </AlertAction>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={InboxIcon} label="New" value={open.filter((l) => l.step <= 2).length} note="Awaiting dispatch" />
        <StatCard icon={TruckIcon} label="In progress" value={open.filter((l) => l.step > 2).length} note="Crew assigned" />
        <StatCard icon={ClockIcon} label="Past guarantee" value={overdue.length} note="On-site SLA missed" tone={overdue.length ? "text-destructive" : undefined} />
        <StatCard icon={CheckCircleIcon} label="Resolved" value={leaks.length - open.length} note="All time" />
      </div>
      <LeaksTable leaks={leaks} staff />
    </PageBody>
  )
}
