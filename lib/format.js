const TZ = "America/Chicago"

export function formatDate(value, opts = {}) {
  // Date-only strings ("2026-10-03") are calendar dates, not instants.
  const date = typeof value === "string" && value.length === 10 ? new Date(`${value}T12:00:00`) : new Date(value)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", ...opts })
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  })
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ })
}

export function formatRelative(value, now = Date.now()) {
  const diff = new Date(value).getTime() - now
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  if (abs < 60_000) return "just now"
  if (abs < 3600_000) return rtf.format(Math.round(diff / 60_000), "minute")
  if (abs < 86400_000) return rtf.format(Math.round(diff / 3600_000), "hour")
  return rtf.format(Math.round(diff / 86400_000), "day")
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export function formatCostRange(low, high) {
  if (!low && !high) return "Included"
  return `${usd.format(low)} – ${usd.format(high)}`
}

export function formatNumber(n) {
  return n.toLocaleString("en-US")
}
