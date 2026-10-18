"use client"

import { CheckCircleIcon, CloudIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"

import { StormMap } from "@/components/maps/storm-map"
import { PageBody, PageHeader } from "@/components/page-header"
import { GradeBadge } from "@/components/status-badges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { toast } from "@/components/ui/toast"
import { useDemoStore } from "@/lib/demo-store"
import { formatDateTime, formatRelative } from "@/lib/format"
import { buildingsInStorm } from "@/lib/geo"
import { BUILDINGS } from "@/lib/mock/buildings"
import { getMember } from "@/lib/mock/users"

export function StormCenter() {
  const { storms, stormAlerts, sendStormAlert } = useDemoStore()
  const storm = storms[0]
  if (!storm) return null

  const affected = buildingsInStorm(storm, BUILDINGS)
  const affectedIds = new Set(affected.map((b) => b.id))
  const members = new Set(affected.map((b) => b.memberId))
  const alert = stormAlerts.find((a) => a.stormId === storm.id)

  const send = () => {
    sendStormAlert(storm.id)
    toast.add({
      type: "success",
      title: `${storm.name} alert sent`,
      description: `${affected.length} buildings across ${members.size} members were notified.`,
    })
  }

  return (
    <PageBody>
      <PageHeader title="Storm center" description="Track named storms and alert members whose buildings are in the path." />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="gap-0 overflow-hidden p-0">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2">
              <CloudIcon className="size-5" />
              {storm.name}
            </CardTitle>
            <CardDescription>
              {storm.category} · {storm.windMph} mph winds · landfall {formatDateTime(storm.landfallAt)}
            </CardDescription>
            <CardAction>
              <Badge variant="destructive">Forecast cone</Badge>
            </CardAction>
          </CardHeader>
          <StormMap storm={storm} buildings={BUILDINGS} affected={affectedIds} className="h-[460px] rounded-none border-0 border-t" />
          <CardFooter className="text-xs text-muted-foreground">{storm.advisory}</CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In the forecast path</CardTitle>
            <CardDescription>
              {affected.length} of {BUILDINGS.length} buildings · {members.size} members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {affected.map((b) => {
                const ack = alert?.acknowledged?.[b.id]
                return (
                  <Item key={b.id} variant="outline" size="sm">
                    <ItemContent>
                      <ItemTitle>{b.name}</ItemTitle>
                      <ItemDescription>{getMember(b.memberId).name}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {alert ? (
                        ack ? (
                          <Badge variant="success">Acknowledged</Badge>
                        ) : (
                          <Badge variant="secondary">Notified</Badge>
                        )
                      ) : (
                        <GradeBadge grade={b.grade} />
                      )}
                    </ItemActions>
                  </Item>
                )
              })}
            </ItemGroup>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            {alert ? (
              <p className="flex items-center gap-1.5 text-sm">
                <CheckCircleIcon className="size-4 text-success" />
                Alert sent {formatRelative(alert.sentAt)}
              </p>
            ) : (
              <Button size="lg" onClick={send}>
                <PaperAirplaneIcon data-icon="inline-start" />
                Send storm alert to {members.size} members
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Members get a prep checklist. Premium buildings in the path are queued for a post-storm site visit.
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageBody>
  )
}
