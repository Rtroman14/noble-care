"use client"

import { PortfolioMap } from "@/components/maps/portfolio-map"
import { Card } from "@/components/ui/card"
import { useDemoStore, useVisibleBuildings, useVisibleStormAlerts } from "@/lib/demo-store"

// Full-width map of every building, shown to Noble staff above the buildings table.
export function StaffBuildingsMap() {
  const { user } = useDemoStore()
  const buildings = useVisibleBuildings()
  const inStorm = new Set(useVisibleStormAlerts().flatMap((a) => a.buildingIds))
  if (user?.role !== "staff") return null
  return (
    <Card className="overflow-hidden p-0 shadow-sm">
      <PortfolioMap buildings={buildings} highlight={inStorm} className="h-[440px] rounded-none border-0" />
    </Card>
  )
}
