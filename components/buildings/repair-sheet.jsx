"use client"

import { useState } from "react"
import { CalendarDaysIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline"

import { PhotoPlaceholder } from "@/components/inspections/photo-tile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCostRange, formatDate } from "@/lib/format"
import { PRIORITIES, getFindingPhotos } from "@/lib/mock/findings"
import { getPlan } from "@/lib/mock/plans"
import { cn } from "@/lib/utils"

const PIN_TONE = { now: "bg-destructive text-white", later: "bg-warning text-warning-foreground", monitor: "bg-info text-white" }
const PRIORITY_BADGE = { now: "destructive", later: "warning", monitor: "info" }
const WHY_IT_MATTERS = {
  now: "Left alone, this is likely to let water in and damage the deck, insulation or interior. We recommend fixing it before the next storm.",
  later: "Not urgent today, but it will get worse. Budgeting for it now avoids a bigger, costlier repair later.",
  monitor: "No action needed yet. Noble will recheck it at every inspection and flag it if it changes.",
}

// One large photo with thumbnails to switch between. Inline rather than a
// lightbox dialog, which would stack under the sheet.
function PhotoViewer({ photos }) {
  const [active, setActive] = useState(0)
  const photo = photos[active]
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Photos</h3>
      <PhotoPlaceholder kind={photo.kind} className="aspect-video w-full rounded-lg" iconClassName="size-12" />
      <p className="text-xs text-muted-foreground">{photo.caption}</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <button
            key={p.caption}
            type="button"
            aria-label={`Show photo ${i + 1}: ${p.caption}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "overflow-hidden rounded-md outline-none ring-offset-2 ring-offset-background transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
              i === active ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            )}
          >
            <PhotoPlaceholder kind={p.kind} className="aspect-[4/3] w-full" iconClassName="size-5" />
          </button>
        ))}
      </div>
    </section>
  )
}

// Side sheet with the photos and details behind one repair recommendation.
// `finding` stays set while the sheet animates closed so content doesn't blank out.
export function RepairSheet({ open, onOpenChange, finding, number, building, inspection, canApprove }) {
  if (!finding) return null
  const plan = getPlan(building.tier)
  const priority = PRIORITIES[finding.priority]
  const photos = getFindingPhotos(finding)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="gap-2 border-b pr-12">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                PIN_TONE[finding.priority]
              )}
            >
              {number}
            </span>
            <Badge variant={PRIORITY_BADGE[finding.priority]}>{priority.label}</Badge>
          </div>
          <SheetTitle className="text-lg">{finding.title}</SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="size-4" />
              {inspection.season} inspection, {formatDate(inspection.date)}
            </span>
            <span className="flex items-center gap-1">
              <UserIcon className="size-4" />
              {inspection.inspector}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <PhotoViewer key={finding.id} photos={photos} />

          <section className="flex flex-col gap-1.5">
            <h3 className="text-sm font-medium">What we found</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{finding.detail}</p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="text-sm font-medium">Why it matters</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{WHY_IT_MATTERS[finding.priority]}</p>
          </section>

          <section className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="mt-0.5 size-4 shrink-0" />
            Marked as pin {number} on the roof map.
          </section>

          {finding.priority !== "monitor" && (
            <>
              <Separator />
              <section className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Estimated cost</span>
                <span className="text-2xl font-bold tracking-tight tabular-nums">
                  {finding.included ? "Included in RAMP" : formatCostRange(finding.costLow, finding.costHigh)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {finding.included
                    ? `Covered by your minor-repair allowance (${plan.repairAllowance}).`
                    : `RAMP ${plan.name} members get ${plan.repairDiscount}% off repairs. Final price confirmed in the proposal.`}
                </span>
              </section>
            </>
          )}
        </div>

        <SheetFooter className="flex-row justify-end border-t">
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
          {canApprove && finding.priority !== "monitor" && !finding.included && (
            <Tooltip>
              <TooltipTrigger render={<span tabIndex={0} />}>
                <Button disabled>Approve repair</Button>
              </TooltipTrigger>
              <TooltipContent>Coming soon: approve and schedule repairs here</TooltipContent>
            </Tooltip>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
