const HOUR = 3600_000

const pts = (arr) => arr.map(([lat, lng]) => ({ lat, lng }))

// A fictional storm whose forecast cone covers west Houston.
export function seedStorms(now = Date.now()) {
  return [
    {
      id: "storm-marisol",
      name: "Tropical Storm Marisol",
      category: "Tropical storm",
      windMph: 65,
      landfallAt: new Date(now + 36 * HOUR).toISOString(),
      advisory:
        "Forecast to make landfall near Freeport and track north over west Houston. Expect 6 to 10 inches of rain and gusts to 60 mph.",
      track: pts([
        [28.45, -95.82], [28.95, -95.75], [29.4, -95.68], [29.85, -95.57],
      ]),
      cone: pts([
        [28.95, -95.8], [29.4, -95.76], [29.85, -95.68], [29.93, -95.57],
        [29.85, -95.46], [29.4, -95.6], [28.95, -95.7], [28.9, -95.75],
      ]),
    },
  ]
}

export const STORM_CHECKLIST = [
  "Clear drains, scuppers and gutters of debris",
  "Secure loose items on the roof and around RTUs",
  "Move inventory away from known leak points",
  "Confirm an on-site contact for Noble's post-storm visit",
]
