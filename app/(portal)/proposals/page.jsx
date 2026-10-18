import { DocumentCheckIcon } from "@heroicons/react/24/outline"

import { ComingSoon } from "@/components/coming-soon"

export const metadata = { title: "Repair proposals · NobleCare" }

export default function ProposalsPage() {
  return (
    <ComingSoon
      icon={DocumentCheckIcon}
      title="Repair proposals"
      description="Review and approve repairs from your inspection reports in one click, with photos for every line item."
      points={["Approve or decline each repair", "Compare options and pricing", "Track scheduled repair dates"]}
    />
  )
}
