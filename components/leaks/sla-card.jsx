"use client"

import { ClockIcon } from "@heroicons/react/24/outline"

import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNow } from "@/hooks/use-now"
import { formatDateTime } from "@/lib/format"
import { formatDuration, leakSla } from "@/lib/leaks"
import { getPlan } from "@/lib/mock/plans"

// Response time against the plan's guarantee. The clock stops when the crew is on site.
export function SlaCard({ leak, building }) {
  const now = useNow(15_000)
  const plan = getPlan(building.tier)
  const sla = leakSla(leak, plan.responseHours, now)

  let status
  if (sla.respondedAt) {
    status = sla.met ? (
      <Badge variant="success">Met guarantee</Badge>
    ) : (
      <Badge variant="destructive">Missed guarantee</Badge>
    )
  } else {
    status = sla.overdue ? <Badge variant="destructive">Overdue</Badge> : <Badge variant="info">On track</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <ClockIcon className="size-4" />
          RAMP {plan.name} · {plan.responseHours}-hour guaranteed response
        </CardDescription>
        <CardTitle className="text-2xl tabular-nums">
          {sla.respondedAt
            ? `Crew on site in ${formatDuration(sla.respondedAt - new Date(leak.reportedAt).getTime())}`
            : sla.overdue
              ? `${formatDuration(sla.remainingMs)} past due`
              : `${formatDuration(sla.remainingMs)} remaining`}
        </CardTitle>
        <CardAction>{status}</CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress value={sla.elapsedPct} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Reported {formatDateTime(leak.reportedAt)}</span>
          <span>Due by {formatDateTime(sla.dueAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
