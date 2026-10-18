const HOUR = 3600_000
const MIN = 60_000

function iso(ms) {
  return new Date(ms).toISOString()
}

// Seeded relative to `now` so the in-progress leak's SLA clock looks live.
export function seedLeaks(now = Date.now()) {
  const open = now - 2 * HOUR - 10 * MIN
  return [
    {
      id: "LK-1043",
      buildingId: "b-sharpstown",
      reportedBy: "Tom Nguyen (Bayou City Logistics)",
      reportedAt: iso(open),
      location: "Suite 140, back storeroom",
      severity: "active",
      notes: "Water coming through a ceiling tile near the back door. Bucket in place.",
      crew: "crew-b",
      step: 4,
      events: [
        { step: 1, at: iso(open), note: "Reported from the NobleCare app." },
        { step: 2, at: iso(open + 1 * MIN), note: "Paged on-call coordinator and Crew B lead." },
        { step: 3, at: iso(open + 9 * MIN), note: "Lyn Carter is coordinating." },
        { step: 4, at: iso(open + 38 * MIN), note: "Crew B (Okafor) en route. ETA 45 min." },
      ],
    },
    {
      id: "LK-1037",
      buildingId: "b-oldkaty",
      reportedBy: "Marcus Reyes",
      reportedAt: "2026-09-22T13:05:00.000Z",
      location: "Loading dock, doors 4 to 6",
      severity: "active",
      notes: "Dripping onto pallets at dock door 5 during the storm.",
      crew: "crew-a",
      step: 7,
      events: [
        { step: 1, at: "2026-09-22T13:05:00.000Z", note: "Reported from the NobleCare app." },
        { step: 2, at: "2026-09-22T13:06:00.000Z", note: "Paged on-call coordinator and Crew A lead." },
        { step: 3, at: "2026-09-22T13:14:00.000Z", note: "Lyn Carter is coordinating." },
        { step: 4, at: "2026-09-22T13:40:00.000Z", note: "Crew A (Ramirez) en route." },
        { step: 5, at: "2026-09-22T16:15:00.000Z", note: "On site. Leak traced to panel lap above door 5." },
        { step: 6, at: "2026-09-22T18:30:00.000Z", note: "Laps sealed and fasteners replaced. Dock is dry." },
        { step: 7, at: "2026-09-23T15:00:00.000Z", note: "Report posted. Permanent repair quoted under Fix now items." },
      ],
    },
    {
      id: "LK-1029",
      buildingId: "b-gaylord",
      reportedBy: "Marcus Reyes",
      reportedAt: "2026-08-14T20:30:00.000Z",
      location: "Tenant space 210, near the HVAC closet",
      severity: "stain",
      notes: "New brown stain on the ceiling after last night's rain.",
      crew: "crew-c",
      step: 7,
      events: [
        { step: 1, at: "2026-08-14T20:30:00.000Z", note: "Reported from the NobleCare app." },
        { step: 2, at: "2026-08-14T20:31:00.000Z", note: "Paged on-call coordinator." },
        { step: 3, at: "2026-08-15T12:10:00.000Z", note: "Lyn Carter is coordinating." },
        { step: 4, at: "2026-08-15T13:00:00.000Z", note: "Crew C (Delgado) scheduled." },
        { step: 5, at: "2026-08-15T15:20:00.000Z", note: "On site. Failed flashing at RTU-6." },
        { step: 6, at: "2026-08-15T17:05:00.000Z", note: "Flashing patched. Permanent repair recommended." },
        { step: 7, at: "2026-08-16T14:00:00.000Z", note: "Report posted." },
      ],
    },
  ]
}
