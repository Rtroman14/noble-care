"use client"

import { GlobeAmericasIcon, MapIcon } from "@heroicons/react/24/outline"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Switches a map between the street map and satellite imagery.
// `satelliteType` is "satellite" (no labels) or "hybrid" (with labels).
export function MapTypeToggle({ value, onChange, mapType = "roadmap", satelliteType = "satellite" }) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(v) => v.length && onChange(v[0])}
      size="sm"
      spacing={0}
      variant="outline"
      className="absolute top-3 left-3 z-10 rounded-lg bg-background shadow-md"
    >
      <ToggleGroupItem value={mapType} aria-label="Map view">
        <MapIcon data-icon="inline-start" />
        Map
      </ToggleGroupItem>
      <ToggleGroupItem value={satelliteType} aria-label="Satellite view">
        <GlobeAmericasIcon data-icon="inline-start" />
        Satellite
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
