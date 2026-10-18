"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BuildingOffice2Icon, ChatBubbleLeftEllipsisIcon, EyeIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline"

import { LeakTimeline } from "@/components/leaks/leak-timeline"
import { SlaCard } from "@/components/leaks/sla-card"
import { PageBody } from "@/components/page-header"
import { LeakStatusBadge } from "@/components/status-badges"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { useDemoStore, useVisibleBuildings } from "@/lib/demo-store"
import { CREWS, SEVERITIES, severityLabel } from "@/lib/leaks"
import { getBuilding } from "@/lib/mock/buildings"
import { getMember } from "@/lib/mock/users"

// Shared by the member view and the staff view; staff get a control panel slot.
export function LeakDetail({ controls }) {
  const { id } = useParams()
  const { leaks, user } = useDemoStore()
  const visible = new Set(useVisibleBuildings().map((b) => b.id))
  const leak = leaks.find((l) => l.id === id && visible.has(l.buildingId))

  if (!leak) {
    return (
      <PageBody>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Leak report not found</EmptyTitle>
            <EmptyDescription>It may have been cleared when the demo was reset.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PageBody>
    )
  }

  const building = getBuilding(leak.buildingId)
  const crew = CREWS.find((c) => c.id === leak.crew)
  const isStaff = user.role === "staff"

  return (
    <PageBody className="max-w-5xl">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-4xl leading-none tracking-wide">Leak {leak.id}</h1>
          <LeakStatusBadge leak={leak} />
          <Badge variant={leak.severity === "active" ? "destructive" : "secondary"}>{SEVERITIES[leak.severity].short}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          <Link href={`/buildings/${building.id}`} className="underline-offset-4 hover:underline">
            {building.name}
          </Link>{" "}
          · {leak.location}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-4">
          <SlaCard leak={leak} building={building} />
          {controls?.(leak)}
          <Card>
            <CardHeader>
              <CardTitle>Report details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <Detail icon={BuildingOffice2Icon} label="Building">
                {building.name}, {building.address}
                {isStaff && <span className="block text-muted-foreground">{getMember(building.memberId).name}</span>}
              </Detail>
              <Detail icon={EyeIcon} label="What they're seeing">{severityLabel(leak)}</Detail>
              <Detail icon={MapPinIcon} label="Location">{leak.location}</Detail>
              <Detail icon={UserIcon} label="Reported by">{leak.reportedBy}</Detail>
              {leak.notes && <Detail icon={ChatBubbleLeftEllipsisIcon} label="Notes">{leak.notes}</Detail>}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Response progress</CardTitle>
            <CardDescription>{crew ? `Assigned to ${crew.name}` : "Updates appear here as Noble's team responds."}</CardDescription>
            <CardAction>
              <span className="text-xs text-muted-foreground tabular-nums">Step {leak.step} of 7</span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <LeakTimeline leak={leak} />
          </CardContent>
        </Card>
      </div>
    </PageBody>
  )
}

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span>{children}</span>
      </div>
    </div>
  )
}
