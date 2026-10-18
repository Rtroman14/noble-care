// Leak response lifecycle. The SLA clock stops when the crew is on site.
export const LEAK_STEPS = [
  { step: 1, key: "reported", title: "Leak reported", description: "Your report was received." },
  { step: 2, key: "notified", title: "Noble team notified", description: "On-call coordinator and crew lead were paged." },
  { step: 3, key: "acknowledged", title: "Dispatcher acknowledged", description: "A coordinator is reviewing your report." },
  { step: 4, key: "dispatched", title: "Crew dispatched", description: "A service crew is on the way." },
  { step: 5, key: "on_site", title: "Crew on site", description: "The crew has arrived and is locating the leak." },
  { step: 6, key: "repaired", title: "Temporary repair complete", description: "The leak is stopped. Permanent repair to follow." },
  { step: 7, key: "report", title: "Report and photos posted", description: "Findings and photos are available." },
]

export const ON_SITE_STEP = 5

export const SEVERITIES = {
  active: { label: "Actively dripping", short: "Active" },
  stain: { label: "Ceiling stain or damp spot", short: "Stain" },
  standing: { label: "Standing water inside", short: "Standing water" },
  other: { label: "Something else", short: "Other" },
}

// What the member reported seeing; "Something else" shows their own words.
export function severityLabel(leak) {
  if (leak.severity === "other" && leak.severityNote) return leak.severityNote
  return SEVERITIES[leak.severity].label
}

export const CREWS = [
  { id: "crew-a", name: "Crew A (Ramirez)" },
  { id: "crew-b", name: "Crew B (Okafor)" },
  { id: "crew-c", name: "Crew C (Delgado)" },
]

export function getStep(step) {
  return LEAK_STEPS.find((s) => s.step === step)
}

export function leakStatusLabel(leak) {
  if (leak.step >= 7) return "Resolved"
  if (leak.step >= ON_SITE_STEP) return "On site"
  if (leak.step >= 4) return "Dispatched"
  if (leak.step >= 3) return "Acknowledged"
  return "New"
}

export function isLeakOpen(leak) {
  return leak.step < 7
}

// Returns { dueAt, respondedAt, remainingMs, elapsedPct, met, overdue }.
export function leakSla(leak, responseHours, now = Date.now()) {
  const reported = new Date(leak.reportedAt).getTime()
  const dueAt = reported + responseHours * 3600_000
  const onSite = leak.events.find((e) => e.step === ON_SITE_STEP)
  const respondedAt = onSite ? new Date(onSite.at).getTime() : null
  const end = respondedAt ?? now
  const elapsedPct = Math.min(100, Math.max(0, ((end - reported) / (dueAt - reported)) * 100))
  return {
    dueAt,
    respondedAt,
    remainingMs: dueAt - now,
    elapsedPct,
    met: respondedAt != null && respondedAt <= dueAt,
    overdue: respondedAt == null ? now > dueAt : respondedAt > dueAt,
  }
}

export function formatDuration(ms) {
  const abs = Math.abs(ms)
  const h = Math.floor(abs / 3600_000)
  const m = Math.floor((abs % 3600_000) / 60_000)
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}
