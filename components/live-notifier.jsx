"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"
import { useDemoStore, useVisibleBuildings } from "@/lib/demo-store"
import { getStep } from "@/lib/leaks"
import { getBuilding } from "@/lib/mock/buildings"

// Turns store changes (often from another tab) into toasts: new leaks for
// staff, progress updates and storm alerts for members.
export function LiveNotifier() {
  const router = useRouter()
  const { user, leaks, stormAlerts, storms } = useDemoStore()
  const buildings = useVisibleBuildings()
  const seen = useRef(null)

  useEffect(() => {
    const snapshot = {
      steps: new Map(leaks.map((l) => [l.id, l.step])),
      alerts: new Set(stormAlerts.map((a) => a.id)),
    }
    const prev = seen.current
    seen.current = snapshot
    if (!prev || !user) return

    const mine = new Set(buildings.map((b) => b.id))

    for (const leak of leaks) {
      const before = prev.steps.get(leak.id)
      const building = getBuilding(leak.buildingId)
      if (user.role === "staff" && before === undefined) {
        toast.add({
          type: "error",
          priority: "high",
          title: `New leak reported at ${building.name}`,
          description: `${leak.location} · ${leak.reportedBy}`,
          timeout: 10000,
          actionProps: { children: "Open", onClick: () => router.push(`/staff/leaks/${leak.id}`) },
        })
      }
      if (user.role !== "staff" && before !== undefined && leak.step > before && leak.step >= 3 && mine.has(leak.buildingId)) {
        toast.add({
          type: "info",
          title: getStep(leak.step).title,
          description: `${building.name} · ${leak.id}`,
          actionProps: { children: "View", onClick: () => router.push(`/leaks/${leak.id}`) },
        })
      }
    }

    if (user.role !== "staff") {
      for (const alert of stormAlerts) {
        if (prev.alerts.has(alert.id)) continue
        const hits = alert.buildingIds.filter((id) => mine.has(id))
        if (!hits.length) continue
        const storm = storms.find((s) => s.id === alert.stormId)
        toast.add({
          type: "warning",
          priority: "high",
          title: `${storm.name} alert`,
          description: `${hits.length} of your buildings ${hits.length === 1 ? "is" : "are"} in the forecast path.`,
          timeout: 12000,
          actionProps: { children: "See details", onClick: () => router.push("/alerts") },
        })
      }
    }
  }, [leaks, stormAlerts, storms, user, buildings, router])

  return null
}
