"use client"

import { useJsApiLoader } from "@react-google-maps/api"
import { MapIcon } from "@heroicons/react/24/outline"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
// Stable reference: the loader warns if this array changes between renders.
const LIBRARIES = ["geometry"]

// Hex values for Maps API styling (CSS variables can't be passed to the Maps API).
export const MAP_COLORS = {
  A: "#16a34a",
  B: "#3d6a9e",
  C: "#f59e0b",
  D: "#b91e31",
  F: "#b91e31",
  roof: "#facc15",
  storm: "#b91e31",
  safe: "#ffffff",
}

export const SATELLITE_OPTIONS = {
  mapTypeId: "satellite",
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  rotateControl: false,
  tilt: 0,
}

function Loaded({ children, className, overlay }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "noblecare-google-maps",
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  })
  if (loadError) return <MapFallback className={className} title="Map failed to load" />
  if (!isLoaded) return <Skeleton className={cn("rounded-xl", className)} />
  return (
    <div className={cn("relative overflow-hidden rounded-xl border", className)}>
      {children}
      {overlay}
    </div>
  )
}

// Renders children once Google Maps is ready, or a fallback without a key.
// `overlay` renders above the map (e.g. the map type toggle).
export function MapFrame({ children, className, overlay }) {
  if (!API_KEY) return <MapFallback className={className} />
  return (
    <Loaded className={className} overlay={overlay}>
      {children}
    </Loaded>
  )
}

function MapFallback({ className, title = "Map preview unavailable" }) {
  return (
    <Empty className={cn("rounded-xl border bg-muted/40", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MapIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to show satellite maps.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

// Fills the relatively positioned frame, so maps size correctly even when the
// frame height comes from flex or min-height.
export const MAP_STYLE = { position: "absolute", inset: 0 }
