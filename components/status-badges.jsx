import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getPlan } from "@/lib/mock/plans"
import { leakStatusLabel } from "@/lib/leaks"

export const GRADE_VARIANT = { A: "success", B: "info", C: "warning", D: "destructive", F: "destructive" }

export function GradeBadge({ grade, className }) {
  return (
    <Badge variant={GRADE_VARIANT[grade]} className={className}>
      Grade {grade}
    </Badge>
  )
}

// A large letter grade tile for headers and cards.
export function GradeMark({ grade, size = "default", className }) {
  const tone = {
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning-foreground dark:text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }[GRADE_VARIANT[grade]]
  return (
    <div
      aria-label={`Roof grade ${grade}`}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-semibold tabular-nums",
        size === "lg" ? "size-16 text-3xl" : "size-11 text-xl",
        tone,
        className
      )}
    >
      {grade}
    </div>
  )
}

export function TierBadge({ tier }) {
  const plan = getPlan(tier)
  return <Badge variant={tier === "premium" ? "default" : "outline"}>RAMP {plan.name}</Badge>
}

const LEAK_VARIANT = {
  New: "destructive",
  Acknowledged: "warning",
  Dispatched: "warning",
  "On site": "info",
  Resolved: "success",
}

export function LeakStatusBadge({ leak }) {
  const label = leakStatusLabel(leak)
  return <Badge variant={LEAK_VARIANT[label]}>{label}</Badge>
}
