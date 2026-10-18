// Repair items from the latest inspection. `offset` places a pin on the roof
// map relative to the building's center.
export const PRIORITIES = {
  now: { label: "Fix now", description: "Risk of leaks or damage if left" },
  later: { label: "Plan for later", description: "Budget within 12 months" },
  monitor: { label: "Monitor", description: "We'll keep an eye on it" },
}

export const FINDINGS = [
  // Westway
  { id: "f-1", buildingId: "b-westway", priority: "now", title: "Open seams on north side", detail: "Two field seams, about 14 ft total, show separation when probed.", costLow: 900, costHigh: 1400, offset: [0.00025, -0.0001], photo: "seam" },
  { id: "f-2", buildingId: "b-westway", priority: "now", title: "East scupper partly blocked", detail: "Debris is restricting overflow. Will be cleared on the next service visit.", costLow: 0, costHigh: 0, included: true, offset: [0.0, 0.0005], photo: "drain" },
  { id: "f-3", buildingId: "b-westway", priority: "later", title: "Walk pads at RTU access", detail: "Add walk pads to protect membrane from service traffic.", costLow: 1800, costHigh: 2600, offset: [-0.0002, 0.0002], photo: "penetration" },
  { id: "f-4", buildingId: "b-westway", priority: "monitor", title: "Minor surface scuffing", detail: "Cosmetic only. No membrane damage.", costLow: 0, costHigh: 0, offset: [-0.0001, -0.0003], photo: "overview" },

  // Glenmont
  { id: "f-5", buildingId: "b-glenmont", priority: "now", title: "Ponding at drains D3 and D4", detail: "Water holds more than 48 hours after rain. Add tapered insulation crickets.", costLow: 4200, costHigh: 6800, offset: [0.0001, -0.0012], photo: "ponding" },
  { id: "f-6", buildingId: "b-glenmont", priority: "now", title: "Cracked flashing at skylight curb", detail: "Visible cracking at the base flashing of two skylights.", costLow: 1500, costHigh: 2200, offset: [0.0002, 0.0008], photo: "flashing" },
  { id: "f-7", buildingId: "b-glenmont", priority: "later", title: "Restoration coating, west third", detail: "Granule loss across about 70,000 sq ft. A silicone restoration would extend roof life 10+ years.", costLow: 118000, costHigh: 142000, offset: [0.0, -0.0015], photo: "overview" },
  { id: "f-8", buildingId: "b-glenmont", priority: "monitor", title: "Soft insulation near roof hatch", detail: "Slight give underfoot. Moisture scan at next inspection.", costLow: 0, costHigh: 0, offset: [0.0002, 0.0002], photo: "seam" },

  // Gaylord
  { id: "f-9", buildingId: "b-gaylord", priority: "now", title: "Failed flashing at RTU-6 curb", detail: "Flashing has pulled away from the curb on the south side.", costLow: 1100, costHigh: 1600, offset: [0.0002, -0.0004], photo: "penetration" },
  { id: "f-10", buildingId: "b-gaylord", priority: "later", title: "Service traffic punctures", detail: "Six small punctures were patched temporarily. Permanent patches recommended.", costLow: 700, costHigh: 1100, offset: [-0.0001, 0.0004], photo: "seam" },

  // Old Katy
  { id: "f-11", buildingId: "b-oldkaty", priority: "now", title: "Active leaks over loading dock", detail: "Two leak points at panel laps above dock doors 4 to 6.", costLow: 3800, costHigh: 5200, offset: [-0.0003, 0.0006], photo: "seam" },
  { id: "f-12", buildingId: "b-oldkaty", priority: "now", title: "Fastener back-out", detail: "About 400 fasteners are backing out across the east half. Replace with oversized fasteners.", costLow: 6500, costHigh: 9000, offset: [0.0002, 0.0005], photo: "overview" },
  { id: "f-13", buildingId: "b-oldkaty", priority: "later", title: "Rust at panel laps", detail: "Surface rust is spreading at laps. Treat and coat before it perforates.", costLow: 48000, costHigh: 61000, offset: [0.0001, -0.0005], photo: "flashing" },
  { id: "f-14", buildingId: "b-oldkaty", priority: "later", title: "Gutter sections pulling loose", detail: "North gutter has sagged at three hangers.", costLow: 2400, costHigh: 3300, offset: [0.00045, 0.0], photo: "drain" },

  // Clarkson
  { id: "f-15", buildingId: "b-clarkson", priority: "monitor", title: "Debris near drain D2", detail: "Cleared on site. No action needed.", costLow: 0, costHigh: 0, offset: [0.0002, 0.0003], photo: "drain" },

  // Katy Freeway
  { id: "f-16", buildingId: "b-katyfwy", priority: "now", title: "Loose perimeter metal, south parapet", detail: "About 60 ft of coping is loose and could lift in high winds.", costLow: 2900, costHigh: 3800, offset: [-0.0005, 0.0], photo: "flashing" },
  { id: "f-17", buildingId: "b-katyfwy", priority: "monitor", title: "Minor membrane shrinkage at corners", detail: "Typical for PVC of this age. Recheck in spring.", costLow: 0, costHigh: 0, offset: [0.0004, -0.0003], photo: "seam" },

  // Shepherd
  { id: "f-18", buildingId: "b-shepherd", priority: "later", title: "Sealant touch-ups at penetrations", detail: "Pitch pocket sealant is drying out at four pipe penetrations.", costLow: 450, costHigh: 750, offset: [0.0001, 0.0002], photo: "penetration" },

  // Sharpstown
  { id: "f-19", buildingId: "b-sharpstown", priority: "now", title: "Cracked pitch pans", detail: "Three pitch pans are cracked and letting water in at the base.", costLow: 900, costHigh: 1300, offset: [0.0002, -0.0002], photo: "penetration" },
  { id: "f-20", buildingId: "b-sharpstown", priority: "now", title: "Blistering at SW corner", detail: "Blisters up to 18 in. across. Cut and patch before the warranty expires.", costLow: 2200, costHigh: 3100, offset: [-0.0002, -0.0003], photo: "seam" },
  { id: "f-21", buildingId: "b-sharpstown", priority: "later", title: "Re-coat cap sheet", detail: "Reflective coating has worn thin.", costLow: 24000, costHigh: 31000, offset: [0.0, 0.0002], photo: "overview" },
]

export function getFindings(buildingId) {
  return FINDINGS.filter((f) => f.buildingId === buildingId)
}

// Deficiency photos for a repair item. Placeholder imagery until CompanyCam
// photos are wired in: a close-up, a wider shot for context, and a detail.
const DETAIL_CAPTION = {
  seam: "Probe test at the seam",
  drain: "Drain basket and outlet",
  flashing: "Flashing termination detail",
  penetration: "Penetration base detail",
  ponding: "Standing water depth check",
  overview: "Surface condition detail",
}

export function getFindingPhotos(finding) {
  return [
    { kind: finding.photo, caption: `Close-up: ${finding.title}` },
    { kind: "overview", caption: "Wide shot showing the location on the roof" },
    { kind: finding.photo, caption: DETAIL_CAPTION[finding.photo] ?? "Detail" },
  ]
}
