import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// KPI tile: label with an icon top right, a large value, and a short note.
export function StatCard({ icon: Icon, label, value, note, tone }) {
  return (
    <Card className="gap-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <CardAction>
          <Icon className="size-5 text-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        <span className={cn("text-2xl font-bold tracking-tight tabular-nums", tone)}>{value}</span>
        {note && <span className="text-xs text-muted-foreground">{note}</span>}
      </CardContent>
    </Card>
  )
}
