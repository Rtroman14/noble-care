"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleMap, OverlayViewF, OVERLAY_MOUSE_TARGET, PolygonF } from "@react-google-maps/api"

import { MAP_COLORS, MAP_STYLE, MapFrame, SATELLITE_OPTIONS } from "@/components/maps/map-frame"
import { MapTypeToggle } from "@/components/maps/map-type-toggle"
import { fitToPoints } from "@/lib/geo"
import { cn } from "@/lib/utils"

const GRADE_TONE = {
  A: "bg-success text-white",
  B: "bg-info text-white",
  C: "bg-warning text-warning-foreground",
  D: "bg-destructive text-white",
  F: "bg-destructive text-white",
}

// Every building in the portfolio as a labeled pin, colored by grade.
// `highlight` (a Set of building ids) outlines buildings in a storm's path.
export function PortfolioMap({ buildings, highlight, className }) {
  const router = useRouter()
  const [mapType, setMapType] = useState("hybrid")
  const options = useMemo(() => ({ ...SATELLITE_OPTIONS, mapTypeId: mapType }), [mapType])
  return (
    <MapFrame
      className={className}
      overlay={<MapTypeToggle value={mapType} onChange={setMapType} satelliteType="hybrid" />}
    >
      <GoogleMap
        mapContainerStyle={MAP_STYLE}
        center={buildings[0]?.center}
        zoom={12}
        options={options}
        onLoad={(map) => fitToPoints(map, buildings.map((b) => b.center), 64)}
      >
        {buildings.map((b) => (
          <PolygonF
            key={`${b.id}-roof`}
            path={b.roofPath}
            options={{ strokeColor: MAP_COLORS[b.grade], strokeWeight: 2, fillColor: MAP_COLORS[b.grade], fillOpacity: 0.35, clickable: false }}
          />
        ))}
        {buildings.map((b) => (
          <OverlayViewF
            key={b.id}
            position={b.center}
            mapPaneName={OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h - 6 })}
          >
            <button
              type="button"
              onClick={() => router.push(`/buildings/${b.id}`)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full bg-background py-1 pr-2.5 pl-1 text-xs font-medium whitespace-nowrap text-foreground shadow-md ring-1 ring-black/10 transition-transform hover:scale-105",
                highlight?.has(b.id) && "ring-2 ring-destructive"
              )}
            >
              <span className={cn("flex size-5 items-center justify-center rounded-full text-[0.7rem] font-semibold", GRADE_TONE[b.grade])}>
                {b.grade}
              </span>
              {b.name}
            </button>
          </OverlayViewF>
        ))}
      </GoogleMap>
    </MapFrame>
  )
}
