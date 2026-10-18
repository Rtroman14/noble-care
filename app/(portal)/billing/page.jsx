import { CreditCardIcon } from "@heroicons/react/24/outline"

import { ComingSoon } from "@/components/coming-soon"

export const metadata = { title: "Billing · NobleCare" }

export default function BillingPage() {
  return (
    <ComingSoon
      icon={CreditCardIcon}
      title="Billing and agreements"
      description="View your RAMP agreement, invoices and payment history, synced from JobTread."
      points={["Download invoices and agreements", "Pay online or set up autopay", "See renewal dates for each building"]}
    />
  )
}
