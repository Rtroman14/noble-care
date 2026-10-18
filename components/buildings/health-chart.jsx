"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const config = { healthScore: { label: "Roof health", color: "var(--chart-2)" } }

export function HealthChart({ inspections }) {
  const data = [...inspections].reverse().map((i) => ({ season: i.season, healthScore: i.healthScore }))
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="season" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis domain={[40, 100]} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="healthScore"
          type="monotone"
          stroke="var(--color-healthScore)"
          fill="var(--color-healthScore)"
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
