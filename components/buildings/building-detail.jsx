"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { CalendarDaysIcon, CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"

import { HealthChart } from "@/components/buildings/health-chart"
import { PhotoTile } from "@/components/inspections/photo-tile"
import { RoofMap } from "@/components/maps/roof-map"
import { PageBody } from "@/components/page-header"
import { GradeBadge, LeakStatusBadge, TierBadge } from "@/components/status-badges"
import { StormBanner } from "@/components/storms/storm-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDemoStore, useVisibleBuildings } from "@/lib/demo-store"
import { formatCostRange, formatDate, formatNumber, formatRelative } from "@/lib/format"
import { severityLabel } from "@/lib/leaks"
import { FINDINGS, PRIORITIES } from "@/lib/mock/findings"
import { getInspections } from "@/lib/mock/inspections"
import { getPlan } from "@/lib/mock/plans"
import { getMember } from "@/lib/mock/users"
import { cn } from "@/lib/utils"

const PIN_TONE = { now: "bg-destructive text-white", later: "bg-warning text-warning-foreground", monitor: "bg-info text-white" }

export function BuildingDetail() {
  const { id } = useParams()
  const { user, leaks } = useDemoStore()
  const building = useVisibleBuildings().find((b) => b.id === id)

  if (!building) {
    return (
      <PageBody>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Building not found</EmptyTitle>
            <EmptyDescription>This building isn&apos;t in your portfolio.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PageBody>
    )
  }

  const isStaff = user.role === "staff"
  const plan = getPlan(building.tier)
  const findings = FINDINGS.filter((f) => f.buildingId === building.id)
  const inspections = getInspections(building.id)
  const buildingLeaks = leaks.filter((l) => l.buildingId === building.id)
  const warrantyExpires = new Date(building.warranty.expires)
  const warrantyActive = warrantyExpires.getTime() > Date.now()

  return (
    <PageBody>
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-display text-4xl leading-none tracking-wide">{building.name}</h1>
        <p className="text-sm text-muted-foreground">
          {building.address}, {building.city}
          {isStaff && ` · ${getMember(building.memberId).name}`}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <TierBadge tier={building.tier} />
          <Badge variant="outline">{building.roofSystem}</Badge>
        </div>
      </div>

      <StormBanner buildingId={building.id} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <RoofMap building={building} findings={findings} className="h-80 lg:h-full lg:min-h-96" />
        <Card>
          <CardHeader>
            <CardTitle>Roof health</CardTitle>
            <CardDescription>From the {inspections[0].season.toLowerCase()} inspection</CardDescription>
            <CardAction>
              <span className="text-2xl font-semibold tabular-nums">{building.healthScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={building.healthScore} />
            <p className="text-sm leading-relaxed">{building.summary}</p>
            <Separator />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Fact label="Roof area" value={`${formatNumber(building.sqft)} sq ft`} />
              <Fact label="Installed" value={`${building.installYear} (${2026 - building.installYear} yrs)`} />
              <Fact label="Last inspection" value={formatDate(building.lastInspection)} />
              <Fact label="Next inspection" value={formatDate(building.nextInspection)} />
              <Fact label="Leak response" value={`${plan.responseHours} hours`} />
              <Fact label="Warranty" value={building.warranty.manufacturer} />
            </dl>
            <div
              className={cn(
                "flex items-start gap-2 rounded-lg p-3 text-xs",
                warrantyActive ? "bg-success/10" : "bg-destructive/10"
              )}
            >
              <ShieldCheckIcon className={cn("size-4 shrink-0", warrantyActive ? "text-success" : "text-destructive")} />
              <span>
                {warrantyActive
                  ? `Warranty active until ${formatDate(building.warranty.expires)}. Bi-annual RAMP inspections keep it valid.`
                  : "Manufacturer warranty has expired. RAMP maintenance is your best protection."}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="repairs">
        <TabsList className="w-full justify-start sm:w-fit">
          <TabsTrigger value="repairs">
            Repairs
            {findings.some((f) => f.priority === "now") && (
              <Badge variant="destructive" className="ml-1">
                {findings.filter((f) => f.priority === "now").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="trend">Health trend</TabsTrigger>
          <TabsTrigger value="leaks">Leaks</TabsTrigger>
        </TabsList>

        <TabsContent value="repairs" className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(PRIORITIES).map(([key, p]) => {
            const items = findings.filter((f) => f.priority === key)
            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className={cn("size-2.5 rounded-full", PIN_TONE[key])} />
                    {p.label}
                  </CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                  <CardAction>
                    <Badge variant="secondary">{items.length}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  {items.length ? (
                    <ItemGroup>
                      {items.map((f) => (
                        <Item key={f.id} variant="outline" size="sm" className="flex-col items-stretch">
                          <div className="flex items-start gap-2">
                            <ItemMedia>
                              <span className={cn("flex size-5 items-center justify-center rounded-full text-[0.7rem] font-semibold", PIN_TONE[f.priority])}>
                                {findings.indexOf(f) + 1}
                              </span>
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle>{f.title}</ItemTitle>
                              <ItemDescription>{f.detail}</ItemDescription>
                            </ItemContent>
                          </div>
                          {key !== "monitor" && (
                            <ItemActions className="justify-between pl-7">
                              <span className="text-xs font-medium tabular-nums">{f.included ? "Included in RAMP" : formatCostRange(f.costLow, f.costHigh)}</span>
                              {!isStaff && !f.included && (
                                <Tooltip>
                                  <TooltipTrigger render={<span tabIndex={0} />}>
                                    <Button size="xs" variant="outline" disabled>
                                      Approve repair
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Coming soon: approve and schedule repairs here</TooltipContent>
                                </Tooltip>
                              )}
                            </ItemActions>
                          )}
                        </Item>
                      ))}
                    </ItemGroup>
                  ) : (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CheckBadgeIcon className="size-4 text-success" />
                      Nothing here
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="inspections" className="mt-2 flex flex-col gap-4">
          {inspections.map((insp, i) => (
            <Card key={insp.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {insp.season} inspection
                  {i === 0 && <Badge variant="secondary">Latest</Badge>}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="size-4" />
                  {formatDate(insp.date)} · {insp.inspector}
                </CardDescription>
                <CardAction>
                  <GradeBadge grade={insp.grade} />
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm">{insp.summary}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {insp.photos.map((photo) => (
                    <PhotoTile key={photo.caption} photo={photo} meta={`${building.name} · ${formatDate(insp.date)}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trend" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Roof health over time</CardTitle>
              <CardDescription>Score at each bi-annual inspection</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthChart inspections={inspections} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaks" className="mt-2">
          {buildingLeaks.length ? (
            <ItemGroup>
              {buildingLeaks.map((leak) => (
                <Item
                  key={leak.id}
                  variant="outline"
                  render={<Link href={isStaff ? `/staff/leaks/${leak.id}` : `/leaks/${leak.id}`} />}
                >
                  <ItemContent>
                    <ItemTitle>
                      {leak.id} · {leak.location}
                    </ItemTitle>
                    <ItemDescription>
                      {severityLabel(leak)} · reported {formatRelative(leak.reportedAt)} by {leak.reportedBy}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <LeakStatusBadge leak={leak} />
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldCheckIcon />
                </EmptyMedia>
                <EmptyTitle>No leaks reported</EmptyTitle>
                <EmptyDescription>If you spot one, use Report a leak and Noble&apos;s team is alerted right away.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </TabsContent>
      </Tabs>
    </PageBody>
  )
}

function Fact({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
