// RAMP tiers, from the RAMP brochure (V2).
export const PLANS = {
  preferred: {
    id: "preferred",
    name: "Preferred",
    responseHours: 48,
    ratePerSf: 0.13,
    annualMinimum: 3000,
    repairAllowance: "4 man-hrs + $250 materials / yr",
    repairDiscount: 5,
    postStormVisit: false,
    perks: [
      "2 inspections/yr, pre- and post-hurricane season",
      "Condition report after each visit",
      "Warranty documentation kept current",
      "Drain and gutter clearing each visit",
      "Minor repairs up to 4 man-hrs + $250 materials/yr",
      "48-hour on-site leak response",
      "Priority scheduling and 5% off repairs",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    responseHours: 24,
    ratePerSf: 0.15,
    annualMinimum: 4000,
    repairAllowance: "8 man-hrs + $500 materials / yr",
    repairDiscount: 10,
    postStormVisit: true,
    perks: [
      "Everything in Preferred",
      "Post-storm site visit after any named storm",
      "Minor repairs up to 8 man-hrs + $500 materials/yr",
      "24-hour on-site leak response",
      "10% off repairs",
    ],
  },
}

export function getPlan(tier) {
  return PLANS[tier] ?? PLANS.preferred
}
