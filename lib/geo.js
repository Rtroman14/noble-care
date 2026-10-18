// Ray-casting point-in-polygon. Works without the Maps API loaded, so storm
// impact is known even when no map is on screen.
export function pointInPolygon(point, polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]
    const b = polygon[j]
    const crosses =
      a.lat > point.lat !== b.lat > point.lat &&
      point.lng < ((b.lng - a.lng) * (point.lat - a.lat)) / (b.lat - a.lat) + a.lng
    if (crosses) inside = !inside
  }
  return inside
}

export function buildingsInStorm(storm, buildings) {
  return buildings.filter((b) => pointInPolygon(b.center, storm.cone))
}

// Waits for the first "idle" so GoogleMap's initial center/zoom props don't
// override the fit right after onLoad.
export function fitToPoints(map, points, padding = 32) {
  if (!map || !points?.length || !window.google?.maps) return
  const bounds = new window.google.maps.LatLngBounds()
  points.forEach((p) => bounds.extend(p))
  window.google.maps.event.addListenerOnce(map, "idle", () => map.fitBounds(bounds, padding))
}
