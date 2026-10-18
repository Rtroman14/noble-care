"use client"

import { useRouter } from "next/navigation"

import { BuildingCard } from "@/components/buildings/building-card"
import { DataTable, SortableHeader } from "@/components/data-table/data-table"
import { GradeBadge, TierBadge } from "@/components/status-badges"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDemoStore, useVisibleBuildings, useVisibleStormAlerts } from "@/lib/demo-store"
import { formatDate } from "@/lib/format"
import { getFindings } from "@/lib/mock/findings"
import { getMember } from "@/lib/mock/users"

const GRADE_ORDER = { A: 1, B: 2, C: 3, D: 4, F: 5 }

export function BuildingsTable() {
  const router = useRouter()
  const { user } = useDemoStore()
  const buildings = useVisibleBuildings()
  const inStorm = new Set(useVisibleStormAlerts().flatMap((a) => a.buildingIds))
  const isStaff = user.role === "staff"

  const data = buildings.map((b) => ({
    ...b,
    member: getMember(b.memberId).name,
    fixNow: getFindings(b.id).filter((f) => f.priority === "now").length,
    gradeRank: GRADE_ORDER[b.grade],
  }))

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Building</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.address}</span>
        </div>
      ),
    },
    ...(isStaff
      ? [{ accessorKey: "member", header: ({ column }) => <SortableHeader column={column}>Member</SortableHeader> }]
      : []),
    {
      accessorKey: "gradeRank",
      header: ({ column }) => <SortableHeader column={column}>Grade</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <GradeBadge grade={row.original.grade} />
          {inStorm.has(row.original.id) && <Badge variant="destructive">Storm</Badge>}
        </div>
      ),
    },
    {
      accessorKey: "healthScore",
      header: ({ column }) => <SortableHeader column={column}>Health</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex w-28 items-center gap-2">
          <Progress value={row.original.healthScore} className="flex-1" />
          <span className="w-6 text-right text-xs tabular-nums">{row.original.healthScore}</span>
        </div>
      ),
    },
    {
      accessorKey: "fixNow",
      header: ({ column }) => <SortableHeader column={column}>Fix now</SortableHeader>,
      cell: ({ row }) =>
        row.original.fixNow ? (
          <span className="font-medium text-destructive tabular-nums">{row.original.fixNow}</span>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
    {
      accessorKey: "lastInspection",
      header: ({ column }) => <SortableHeader column={column}>Last inspection</SortableHeader>,
      cell: ({ row }) => formatDate(row.original.lastInspection),
    },
    {
      accessorKey: "nextInspection",
      header: ({ column }) => <SortableHeader column={column}>Next inspection</SortableHeader>,
      cell: ({ row }) => formatDate(row.original.nextInspection),
    },
    {
      accessorKey: "tier",
      header: "Plan",
      cell: ({ row }) => <TierBadge tier={row.original.tier} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Search buildings..."
      initialSorting={[{ id: "healthScore", desc: false }]}
      onRowClick={(b) => router.push(`/buildings/${b.id}`)}
      renderMobileRow={(b) => <BuildingCard building={b} inStorm={inStorm.has(b.id)} />}
    />
  )
}
