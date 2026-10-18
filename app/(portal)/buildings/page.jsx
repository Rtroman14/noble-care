import { StaffBuildingsMap } from "@/components/buildings/buildings-map"
import { BuildingsTable } from "@/components/buildings/buildings-table"
import { PageBody, PageHeader } from "@/components/page-header"

export const metadata = { title: "Buildings · NobleCare" }

export default function BuildingsPage() {
  return (
    <PageBody>
      <PageHeader title="Buildings" description="Every roof under RAMP, sorted by roof health." />
      <StaffBuildingsMap />
      <BuildingsTable />
    </PageBody>
  )
}
