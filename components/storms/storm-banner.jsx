"use client"

import Link from "next/link"
import { CloudIcon } from "@heroicons/react/24/outline"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useVisibleStormAlerts } from "@/lib/demo-store"
import { formatDateTime } from "@/lib/format"
import { getBuilding } from "@/lib/mock/buildings"
import { getPlan } from "@/lib/mock/plans"

// Shows the latest storm alert touching the user's buildings (optionally one building).
export function StormBanner({ buildingId }) {
  const alerts = useVisibleStormAlerts().filter((a) => !buildingId || a.buildingIds.includes(buildingId))
  const alert = alerts[0]
  if (!alert) return null
  const names = alert.buildingIds.map((id) => getBuilding(id).name)
  return (
    <Alert variant="warning">
      <CloudIcon />
      <AlertTitle>{alert.storm.name} is forecast to reach your {buildingId ? "building" : "buildings"}</AlertTitle>
      <AlertDescription>
        Landfall expected {formatDateTime(alert.storm.landfallAt)}.{" "}
        {buildingId
          ? getPlan(getBuilding(buildingId).tier).postStormVisit
            ? "Your Premium plan includes a post-storm site visit."
            : "You can request a post-storm site visit once it passes."
          : `In the path: ${names.join(", ")}.`}
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" render={<Link href="/alerts" />} nativeButton={false}>
          Prepare
        </Button>
      </AlertAction>
    </Alert>
  )
}
