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
import { formatDateTime, formatTime } from "@/lib/format"
import { CREWS, LEAK_STEPS } from "@/lib/leaks"
import { cn } from "@/lib/utils"

// `compact` shows titles only, for the horizontal summary on dashboards.
export function LeakTimeline({ leak, orientation = "vertical", compact = false, className }) {
  const crew = CREWS.find((c) => c.id === leak.crew)
  return (
    <Timeline value={leak.step} orientation={orientation} className={className}>
      {LEAK_STEPS.map((s) => {
        const event = leak.events.find((e) => e.step === s.step)
        const current = s.step === leak.step && leak.step < LEAK_STEPS.length
        return (
          <TimelineItem key={s.step} step={s.step} className={cn(!event && "opacity-50")}>
            <TimelineHeader>
              <TimelineSeparator />
              {!compact && <TimelineDate>{event ? formatDateTime(event.at) : "Pending"}</TimelineDate>}
              <TimelineTitle className={cn(current && "text-primary")}>
                {s.title}
                {!compact && s.key === "dispatched" && crew && event ? ` · ${crew.name}` : ""}
              </TimelineTitle>
              <TimelineIndicator
                className={cn(
                  "flex items-center justify-center group-data-completed/timeline-item:border-none group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground",
                  current && "ring-4 ring-primary/20"
                )}
              >
                {event && <CheckIcon className="size-3" />}
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
