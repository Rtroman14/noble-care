"use client"

import { CheckIcon } from "@heroicons/react/24/solid"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline"
import { Spinner } from "@/components/ui/spinner"
import { formatDateTime, formatTime } from "@/lib/format"
import { CREWS, LEAK_STEPS } from "@/lib/leaks"
import { cn } from "@/lib/utils"

// `compact` shows titles only, for the horizontal summary on dashboards.
// The step after the last completed one shows a spinner as "In progress",
// and the line leading into it fades out to show it's partway there.
export function LeakTimeline({ leak, orientation = "vertical", compact = false, className }) {
  const crew = CREWS.find((c) => c.id === leak.crew)
  const activeStep = leak.step < LEAK_STEPS.length ? leak.step + 1 : null
  return (
    <Timeline value={leak.step} orientation={orientation} className={className}>
      {LEAK_STEPS.map((s) => {
        const event = leak.events.find((e) => e.step === s.step)
        const active = s.step === activeStep
        const leadsToActive = activeStep != null && s.step === activeStep - 1
        return (
          <TimelineItem key={s.step} step={s.step} className={cn(!event && !active && "opacity-50")}>
            <TimelineHeader>
              <TimelineSeparator
                className={cn(
                  leadsToActive &&
                    "from-primary to-primary/10 group-data-[orientation=horizontal]/timeline:bg-linear-to-r group-data-[orientation=vertical]/timeline:bg-linear-to-b"
                )}
              />
              {!compact && (
                <TimelineDate className={cn(active && "text-primary")}>
                  {event ? formatDateTime(event.at) : active ? "In progress" : "Pending"}
                </TimelineDate>
              )}
              <TimelineTitle>
                {s.title}
                {!compact && s.key === "dispatched" && crew && event ? ` · ${crew.name}` : ""}
              </TimelineTitle>
              <TimelineIndicator
                className={cn(
                  "flex items-center justify-center group-data-completed/timeline-item:border-none group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground",
                  active && "border-none bg-background text-primary"
                )}
              >
                {event && <CheckIcon className="size-3" />}
                {active && <Spinner className="size-4" />}
              </TimelineIndicator>
            </TimelineHeader>
            {compact ? (
              event && <TimelineDate className="mt-0.5">{formatTime(event.at)}</TimelineDate>
            ) : (
              <TimelineContent>{event?.note ?? s.description}</TimelineContent>
            )}
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}
