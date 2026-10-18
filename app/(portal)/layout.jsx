import { Suspense } from "react"

import { PortalShell, ShellSkeleton } from "@/components/portal-shell"

// The portal renders from client-side demo state (signed-in persona, leaks,
// alerts), so its static shell is intentionally just the skeleton.
export const instant = false

export default function PortalLayout({ children }) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <PortalShell>{children}</PortalShell>
    </Suspense>
  )
}
