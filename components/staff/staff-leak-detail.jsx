"use client"

import { LeakDetail } from "@/components/leaks/leak-detail"
import { LeakControls } from "@/components/staff/leak-controls"

export function StaffLeakDetail() {
  return <LeakDetail controls={(leak) => <LeakControls leak={leak} />} />
}
