import { BUILDINGS } from "./buildings"

const INSPECTORS = ["Carlos Medina", "Jared Pruitt", "Alicia Novak"]

// Health score at each inspection, oldest first. The last entry matches the
// building's current score.
const HISTORY = {
  "b-westway": [88, 86, 84, 82],
  "b-glenmont": [79, 75, 72, 68],
  "b-gaylord": [84, 83, 80, 79],
  "b-oldkaty": [70, 66, 61, 54],
  "b-clarkson": [96, 95, 94, 93],
  "b-katyfwy": [82, 80, 79, 77],
  "b-shepherd": [89, 87, 86, 84],
  "b-sharpstown": [80, 77, 74, 71],
}

const SEASONS = [
  { label: "Spring 2025", month: "2025-04" },
  { label: "Fall 2025", month: "2025-10" },
  { label: "Spring 2026", month: "2026-04" },
  { label: "Fall 2026", month: "2026-10" },
]

const PHOTO_SETS = [
  [
    { kind: "overview", caption: "Roof overview, looking north" },
    { kind: "drain", caption: "Primary drain, cleared of debris" },
    { kind: "seam", caption: "Field seams probed, no voids found" },
  ],
  [
    { kind: "overview", caption: "Roof overview, looking south" },
    { kind: "flashing", caption: "Parapet wall flashing" },
    { kind: "penetration", caption: "RTU curb and penetrations" },
    { kind: "ponding", caption: "Ponding after rainfall" },
  ],
]

export function scoreToGrade(score) {
  if (score >= 90) return "A"
  if (score >= 75) return "B"
  if (score >= 60) return "C"
  if (score >= 45) return "D"
  return "F"
}

export const INSPECTIONS = BUILDINGS.flatMap((building, bIndex) =>
  SEASONS.map((season, sIndex) => {
    const score = HISTORY[building.id][sIndex]
    const isLatest = sIndex === SEASONS.length - 1
    const day = String(3 + ((bIndex * 3 + sIndex) % 20)).padStart(2, "0")
    return {
      id: `insp-${building.id}-${sIndex}`,
      buildingId: building.id,
      season: season.label,
      date: isLatest ? building.lastInspection : `${season.month}-${day}`,
      inspector: INSPECTORS[(bIndex + sIndex) % INSPECTORS.length],
      healthScore: score,
      grade: scoreToGrade(score),
      summary: isLatest
        ? building.summary
        : "Routine bi-annual inspection. Drains cleared, seams probed, and minor maintenance completed on site.",
      photos: PHOTO_SETS[(bIndex + sIndex) % PHOTO_SETS.length],
    }
  }).reverse()
)

export function getInspections(buildingId) {
  return INSPECTIONS.filter((i) => i.buildingId === buildingId)
}
