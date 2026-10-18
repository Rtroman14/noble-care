"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  HeartIcon,
  ShieldExclamationIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline"

import { BuildingsTable } from "@/components/buildings/buildings-table"
import { PortfolioMap } from "@/components/maps/portfolio-map"
import { RoofMap } from "@/components/maps/roof-map"
import { PageBody, PageHeader } from "@/components/page-header"
import { GradeMark, TierBadge } from "@/components/status-badges"
import { StatCard } from "@/components/stat-card"
import { StormBanner } from "@/components/storms/storm-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useCurrentUser, useVisibleBuildings, useVisibleLeaks, useVisibleStormAlerts } from "@/lib/demo-store"
import { formatDate } from "@/lib/format"
import { isLeakOpen } from "@/lib/leaks"
import { FINDINGS, PRIORITIES, getFindings } from "@/lib/mock/findings"
import { getInspections } from "@/lib/mock/inspections"
import { getMember } from "@/lib/mock/users"
import { cn } from "@/lib/utils"

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

export function MemberDashboard() {
  const user = useCurrentUser()
  const buildings = useVisibleBuildings()
  const first = user.name.split(" ")[0]
  return buildings.length === 1 ? (
    <OwnerDashboard building={buildings[0]} title={`${greeting()}, ${first}`} />
  ) : (
    <PortfolioDashboard buildings={buildings} title={`${greeting()}, ${first}`} org={getMember(user.memberId).name} />
  )
}

function OwnerDashboard({ building, title }) {
  const findings = getFindings(building.id)
  const latest = getInspections(building.id)[0]
  const counts = Object.fromEntries(Object.keys(PRIORITIES).map((p) => [p, findings.filter((f) => f.priority === p).length]))

  return (
    <PageBody>
      <PageHeader title={title} description="Here's how your roof is doing." />
      <StormBanner />
      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-start gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-xl font-semibold">{building.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {building.address}, {building.city}
                </p>
                <div className="mt-1">
                  <TierBadge tier={building.tier} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Roof health score</span>
                <span className="font-medium tabular-nums">{building.healthScore}/100</span>
              </div>
              <Progress value={building.healthScore} />
            </div>
            <p className="text-sm leading-relaxed">{building.summary}</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Stat label="Fix now" value={counts.now} tone={counts.now ? "text-destructive" : undefined} />
              <Stat label="Plan for later" value={counts.later} />
              <Stat label="Monitor" value={counts.monitor} />
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-4" />
                Last inspected {formatDate(latest.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-4" />
                Next inspection {formatDate(building.nextInspection)}
              </span>
            </div>
            <Button className="self-start" render={<Link href={`/buildings/${building.id}`} />} nativeButton={false}>
              View full roof report
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
          <RoofMap building={building} findings={findings} className="min-h-72 rounded-none border-0 lg:min-h-full" />
        </div>
      </Card>
    </PageBody>
  )
}

function Stat({ label, value, tone }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-muted/50 p-3">
      <span className={cn("text-2xl font-semibold tabular-nums", tone)}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function PortfolioDashboard({ buildings, title, org }) {
  const leaks = useVisibleLeaks()
  const alerts = useVisibleStormAlerts()
  const inStorm = new Set(alerts.flatMap((a) => a.buildingIds))
  const ids = new Set(buildings.map((b) => b.id))
  const fixNow = FINDINGS.filter((f) => ids.has(f.buildingId) && f.priority === "now").length
  const avg = Math.round(buildings.reduce((s, b) => s + b.healthScore, 0) / buildings.length)
  const openLeaks = leaks.filter(isLeakOpen).length
  const needsAttention = [...buildings].sort((a, b) => a.healthScore - b.healthScore).slice(0, 3)

  return (
    <PageBody>
      <PageHeader title={title} description={`${org} · ${buildings.length} buildings under RAMP`} />
      <StormBanner />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BuildingOffice2Icon} label="Buildings" value={buildings.length} note={`${buildings.reduce((s, b) => s + b.sqft, 0).toLocaleString()} sq ft`} />
        <StatCard icon={HeartIcon} label="Avg. roof health" value={avg} note="Out of 100, all roofs" />
        <StatCard icon={WrenchScrewdriverIcon} label="Fix-now items" value={fixNow} note="From latest inspections" tone={fixNow ? "text-destructive" : undefined} />
        <StatCard icon={ShieldExclamationIcon} label="Open leaks" value={openLeaks} note={openLeaks ? "Noble is responding" : "All clear"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="min-h-[420px] overflow-hidden p-0 shadow-sm">
          <PortfolioMap buildings={buildings} highlight={inStorm} className="min-h-[420px] flex-1 rounded-none border-0" />
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>Lowest roof health first</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {needsAttention.map((b) => {
                const n = getFindings(b.id).filter((f) => f.priority === "now").length
                return (
                  <Item key={b.id} size="sm" render={<Link href={`/buildings/${b.id}`} />}>
                    <GradeMark grade={b.grade} />
                    <ItemContent>
                      <ItemTitle>{b.name}</ItemTitle>
                      <ItemDescription>{n ? `${n} fix-now item${n > 1 ? "s" : ""}` : "No urgent repairs"}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {inStorm.has(b.id) && <Badge variant="destructive">Storm</Badge>}
                      <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </ItemActions>
                  </Item>
                )
              })}
            </ItemGroup>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" render={<Link href="/buildings" />} nativeButton={false}>
              All buildings
            </Button>
          </CardFooter>
        </Card>
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl leading-none tracking-wide">All buildings</h2>
        <BuildingsTable />
      </section>
    </PageBody>
  )
}
