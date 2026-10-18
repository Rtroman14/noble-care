import Link from "next/link"
import { CalendarDaysIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GradeMark, TierBadge } from "@/components/status-badges"
import { formatDate } from "@/lib/format"
import { getFindings } from "@/lib/mock/findings"

export function BuildingCard({ building, inStorm }) {
  const findings = getFindings(building.id)
  const fixNow = findings.filter((f) => f.priority === "now").length
  return (
    <Link href={`/buildings/${building.id}`} className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader>
          <CardTitle className="truncate">{building.name}</CardTitle>
          <CardDescription className="truncate">{building.address}</CardDescription>
          <CardAction>
            <GradeMark grade={building.grade} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Roof health</span>
            <span className="font-medium tabular-nums">{building.healthScore}/100</span>
          </div>
          <Progress value={building.healthScore} />
        </CardContent>
        <CardFooter className="flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <WrenchScrewdriverIcon className="size-3.5" />
            {fixNow ? `${fixNow} fix-now item${fixNow > 1 ? "s" : ""}` : "No urgent repairs"}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDaysIcon className="size-3.5" />
            Next inspection {formatDate(building.nextInspection, { year: undefined })}
          </span>
          <span className="ml-auto flex gap-1">
            {inStorm && <span className="font-medium text-destructive">In storm path</span>}
            <TierBadge tier={building.tier} />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
