"use client"

import Link from "next/link"
import { CheckCircleIcon, CheckIcon, CloudIcon, SunIcon } from "@heroicons/react/24/outline"

import { StormMap } from "@/components/maps/storm-map"
import { PageBody, PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { useDemoStore, useVisibleBuildings, useVisibleStormAlerts } from "@/lib/demo-store"
import { formatDateTime, formatRelative } from "@/lib/format"
import { getBuilding } from "@/lib/mock/buildings"
import { getPlan } from "@/lib/mock/plans"
import { STORM_CHECKLIST } from "@/lib/mock/storms"

export function MemberAlerts() {
  const alerts = useVisibleStormAlerts()
  const buildings = useVisibleBuildings()
  const { acknowledgeAlert } = useDemoStore()

  return (
    <PageBody>
      <PageHeader title="Storm alerts" description="Noble watches every named storm and alerts you when your buildings are in the path." />
      {alerts.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SunIcon />
            </EmptyMedia>
            <EmptyTitle>No active storm alerts</EmptyTitle>
            <EmptyDescription>
              We&apos;ll notify you here and by text as soon as a named storm threatens one of your buildings.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {alerts.map((alert) => {
        const affected = new Set(alert.buildingIds)
        return (
          <div key={alert.id} className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card className="gap-0 overflow-hidden p-0">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center gap-2">
                  <CloudIcon className="size-5" />
                  {alert.storm.name}
                </CardTitle>
                <CardDescription>
                  Landfall expected {formatDateTime(alert.storm.landfallAt)} · alert sent {formatRelative(alert.sentAt)}
                </CardDescription>
                <CardAction>
                  <Badge variant="destructive">{alert.buildingIds.length} in path</Badge>
                </CardAction>
              </CardHeader>
              <StormMap storm={alert.storm} buildings={buildings} affected={affected} className="h-96 rounded-none border-0 border-t" />
              <p className="border-t p-4 text-sm text-muted-foreground">{alert.storm.advisory}</p>
            </Card>
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your buildings in the path</CardTitle>
                  <CardDescription>Let us know you&apos;ve seen this and prepared.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemGroup>
                    {alert.buildingIds.map((id) => {
                      const b = getBuilding(id)
                      const ack = alert.acknowledged?.[id]
                      return (
                        <Item key={id} variant="outline" size="sm">
                          <ItemContent>
                            <ItemTitle>
                              <Link href={`/buildings/${id}`} className="hover:underline">
                                {b.name}
                              </Link>
                            </ItemTitle>
                            <ItemDescription>
                              {getPlan(b.tier).postStormVisit
                                ? "Post-storm site visit included (Premium)"
                                : "Post-storm visit available on request"}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            {ack ? (
                              <Badge variant="success">
                                <CheckCircleIcon data-icon="inline-start" />
                                Prepared
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id, id)}>
                                Mark prepared
                              </Button>
                            )}
                          </ItemActions>
                        </Item>
                      )
                    })}
                  </ItemGroup>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Before the storm</CardTitle>
                  <CardDescription>A quick checklist from Noble&apos;s crews</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {STORM_CHECKLIST.map((item, i) => (
                    <div key={item} className="flex flex-col gap-3">
                      {i > 0 && <Separator />}
                      <div className="flex items-start gap-2 text-sm">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                        {item}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      })}
    </PageBody>
  )
}
