"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { DataTable, SortableHeader } from "@/components/data-table/data-table"
import { LeakStatusBadge } from "@/components/status-badges"
import { Badge } from "@/components/ui/badge"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { useNow } from "@/hooks/use-now"
import { formatDateTime, formatRelative } from "@/lib/format"
import { SEVERITIES, formatDuration, isLeakOpen, leakSla } from "@/lib/leaks"
import { getBuilding } from "@/lib/mock/buildings"
import { getPlan } from "@/lib/mock/plans"
import { getMember } from "@/lib/mock/users"
import { cn } from "@/lib/utils"

function SlaCell({ leak, now }) {
  const building = getBuilding(leak.buildingId)
  const sla = leakSla(leak, getPlan(building.tier).responseHours, now)
  if (sla.respondedAt) {
    return <Badge variant={sla.met ? "success" : "destructive"}>{sla.met ? "Met" : "Missed"}</Badge>
  }
  return (
    <span className={cn("text-sm tabular-nums", sla.overdue ? "font-medium text-destructive" : "text-foreground")}>
      {sla.overdue ? `${formatDuration(sla.remainingMs)} over` : `${formatDuration(sla.remainingMs)} left`}
    </span>
  )
}

// Leak reports table. `staff` adds the member column and links to the staff view.
export function LeaksTable({ leaks, staff = false }) {
  const router = useRouter()
  const now = useNow(15_000)
  const hrefFor = (leak) => (staff ? `/staff/leaks/${leak.id}` : `/leaks/${leak.id}`)

  const data = leaks.map((l) => {
    const building = getBuilding(l.buildingId)
    return {
      ...l,
      buildingName: building.name,
      member: getMember(building.memberId).name,
      reportedMs: new Date(l.reportedAt).getTime(),
      openRank: isLeakOpen(l) ? 0 : 1,
    }
  })

  const columns = [
    {
      accessorKey: "buildingName",
      header: ({ column }) => <SortableHeader column={column}>Building</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="flex items-center gap-1.5 font-medium">
            {staff && row.original.isNew && <span className="size-2 rounded-full bg-destructive" />}
            {row.original.buildingName}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.id} · {row.original.location}
          </span>
        </div>
      ),
    },
    ...(staff
      ? [{ accessorKey: "member", header: ({ column }) => <SortableHeader column={column}>Member</SortableHeader> }]
      : []),
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <Badge variant={row.original.severity === "active" ? "destructive" : "secondary"}>
          {SEVERITIES[row.original.severity].short}
        </Badge>
      ),
    },
    {
      accessorKey: "reportedMs",
      header: ({ column }) => <SortableHeader column={column}>Reported</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{formatDateTime(row.original.reportedAt)}</span>
          <span className="text-xs text-muted-foreground">{formatRelative(row.original.reportedAt, now)}</span>
        </div>
      ),
    },
    {
      id: "sla",
      header: "Response guarantee",
      cell: ({ row }) => <SlaCell leak={row.original} now={now} />,
    },
    {
      accessorKey: "openRank",
      header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
      cell: ({ row }) => <LeakStatusBadge leak={row.original} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="buildingName"
      filterPlaceholder="Search by building..."
      initialSorting={[{ id: "openRank", desc: false }, { id: "reportedMs", desc: true }]}
      onRowClick={(l) => router.push(hrefFor(l))}
      rowClassName={(l) => staff && l.isNew && "bg-destructive/5"}
      emptyMessage="No leak reports yet."
      renderMobileRow={(l) => (
        <Item variant="outline" render={<Link href={hrefFor(l)} />}>
          <ItemContent>
            <ItemTitle>{l.buildingName}</ItemTitle>
            <ItemDescription>
              {l.location} · {formatRelative(l.reportedAt, now)}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="flex-col items-end">
            <LeakStatusBadge leak={l} />
            <SlaCell leak={l} now={now} />
          </ItemActions>
        </Item>
      )}
    />
  )
}
