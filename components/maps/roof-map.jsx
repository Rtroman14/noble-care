"use client"

import { useMemo, useState } from "react"
import { GoogleMap, OverlayViewF, OVERLAY_MOUSE_TARGET, PolygonF } from "@react-google-maps/api"

import { MAP_COLORS, MAP_STYLE, MapFrame, SATELLITE_OPTIONS } from "@/components/maps/map-frame"
import { MapTypeToggle } from "@/components/maps/map-type-toggle"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { formatCostRange } from "@/lib/format"
import { PRIORITIES } from "@/lib/mock/findings"
import { fitToPoints } from "@/lib/geo"
import { cn } from "@/lib/utils"

const PIN_TONE = {
  now: "bg-destructive text-white",
  later: "bg-warning text-warning-foreground",
  monitor: "bg-info text-white",
}

const PRIORITY_BADGE = { now: "destructive", later: "warning", monitor: "info" }

const center = (pin) => ({ x: -pin.width / 2, y: -pin.height / 2 })

// Numbered pin that shows the finding's details on hover (or tap/focus).
function FindingPin({ finding, number }) {
  const priority = PRIORITIES[finding.priority]
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={80}
        closeDelay={120}
        render={<button type="button" aria-label={`Finding ${number}: ${finding.title}`} />}
        className={cn(
          "flex size-6 cursor-default items-center justify-center rounded-full text-xs font-semibold shadow-md ring-2 ring-white transition-transform outline-none hover:scale-110 focus-visible:ring-ring data-popup-open:scale-110",
          PIN_TONE[finding.priority]
        )}
      >
        {number}
      </HoverCardTrigger>
      <HoverCardContent side="top" sideOffset={8} className="flex w-72 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <span className={cn("flex size-5 items-center justify-center rounded-full text-[0.7rem] font-semibold", PIN_TONE[finding.priority])}>
            {number}
          </span>
          <Badge variant={PRIORITY_BADGE[finding.priority]}>{priority.label}</Badge>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{finding.title}</p>
          <p className="text-xs text-muted-foreground">{finding.detail}</p>
        </div>
        {finding.priority !== "monitor" && (
          <p className="border-t pt-2 text-xs">
            <span className="text-muted-foreground">Estimate: </span>
            <span className="font-medium tabular-nums">
              {finding.included ? "Included in RAMP" : formatCostRange(finding.costLow, finding.costHigh)}
            </span>
          </p>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

// Satellite view of one roof with numbered finding pins.
export function RoofMap({ building, findings = [], className }) {
  const [mapType, setMapType] = useState("satellite")
  const options = useMemo(() => ({ ...SATELLITE_OPTIONS, mapTypeId: mapType }), [mapType])
  return (
    <MapFrame className={className} overlay={<MapTypeToggle value={mapType} onChange={setMapType} />}>
      <GoogleMap
        mapContainerStyle={MAP_STYLE}
        center={building.center}
        zoom={18}
        options={options}
        onLoad={(map) => fitToPoints(map, building.roofPath, 24)}
      >
        <PolygonF
          path={building.roofPath}
          options={{
            strokeColor: MAP_COLORS.roof,
            strokeWeight: 2,
            fillColor: MAP_COLORS.roof,
            fillOpacity: 0.12,
            clickable: false,
          }}
        />
        {findings.map((f, i) => (
          <OverlayViewF
            key={f.id}
            position={{ lat: building.center.lat + f.offset[0], lng: building.center.lng + f.offset[1] }}
            mapPaneName={OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(w, h) => center({ width: w, height: h })}
          >
            <FindingPin finding={f} number={i + 1} />
          </OverlayViewF>
        ))}
      </GoogleMap>
    </MapFrame>
  )
}
