"use client"

import { useMemo, useState } from "react"
import { GoogleMap, OverlayViewF, OVERLAY_MOUSE_TARGET, PolygonF, PolylineF } from "@react-google-maps/api"

import { MAP_COLORS, MAP_STYLE, MapFrame } from "@/components/maps/map-frame"
import { MapTypeToggle } from "@/components/maps/map-type-toggle"
import { fitToPoints } from "@/lib/geo"
import { cn } from "@/lib/utils"

// Forecast cone and track over member buildings. Buildings in `affected` turn red.
export function StormMap({ storm, buildings, affected, className }) {
  const [mapType, setMapType] = useState("terrain")
  const options = useMemo(
    () => ({ mapTypeId: mapType, disableDefaultUI: true, zoomControl: true, fullscreenControl: true }),
    [mapType]
  )
  return (
    <MapFrame
      className={className}
      overlay={<MapTypeToggle value={mapType} onChange={setMapType} mapType="terrain" satelliteType="hybrid" />}
    >
      <GoogleMap
        mapContainerStyle={MAP_STYLE}
        center={buildings[0]?.center}
        zoom={9}
        options={options}
        onLoad={(map) => fitToPoints(map, [...storm.cone, ...buildings.map((b) => b.center)], 32)}
      >
        <PolygonF
          path={storm.cone}
          options={{ strokeColor: MAP_COLORS.storm, strokeWeight: 1.5, fillColor: MAP_COLORS.storm, fillOpacity: 0.18, clickable: false }}
        />
        <PolylineF
          path={storm.track}
          options={{
            strokeColor: MAP_COLORS.storm,
            strokeOpacity: 0,
            icons: [{ icon: { path: "M 0,-1 0,1", strokeOpacity: 0.9, scale: 3 }, offset: "0", repeat: "14px" }],
          }}
        />
        {buildings.map((b) => {
          const hit = affected.has(b.id)
          return (
            <OverlayViewF
              key={b.id}
              position={b.center}
              mapPaneName={OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
            >
              <div
                title={b.name}
                className={cn(
                  "size-3.5 rounded-full shadow ring-2 ring-white",
                  hit ? "animate-pulse bg-destructive" : "bg-muted-foreground"
                )}
              />
            </OverlayViewF>
          )
        })}
      </GoogleMap>
    </MapFrame>
  )
}
