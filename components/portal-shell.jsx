"use client"

import { Fragment, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"

import { AppSidebar } from "@/components/app-sidebar"
import { LiveNotifier } from "@/components/live-notifier"
import { homeFor } from "@/components/login-form"
import { ReportLeakProvider, useReportLeak } from "@/components/leaks/report-leak"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoStore } from "@/lib/demo-store"
import { getBuilding } from "@/lib/mock/buildings"

const LABELS = {
  dashboard: "Dashboard",
  buildings: "Buildings",
  leaks: "Leak reports",
  alerts: "Storm alerts",
  billing: "Billing",
  proposals: "Repair proposals",
  staff: "Request queue",
  storms: "Storm center",
}

function crumbsFor(pathname) {
  const parts = pathname.split("/").filter(Boolean)
  const crumbs = []
  let href = ""
  parts.forEach((part, i) => {
    href += `/${part}`
    // /staff/leaks/[id] has no index page for "leaks", so skip that crumb.
    if (parts[0] === "staff" && part === "leaks") return
    const label = LABELS[part] ?? getBuilding(part)?.name ?? part
    crumbs.push({ href, label })
  })
  return crumbs
}

function Header() {
  const pathname = usePathname()
  const { user } = useDemoStore()
  const { openReportLeak } = useReportLeak()
  const crumbs = crumbsFor(pathname)
  const isMember = user.role !== "staff"
  const buildingId = pathname.startsWith("/buildings/") ? pathname.split("/")[2] : undefined

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4 self-center!" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((c, i) => (
            <Fragment key={c.href}>
              {i > 0 && <BreadcrumbSeparator className="hidden sm:block" />}
              <BreadcrumbItem className={i < crumbs.length - 1 ? "hidden sm:inline-flex" : "min-w-0"}>
                {i < crumbs.length - 1 ? (
                  <BreadcrumbLink render={<Link href={c.href} />}>{c.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate">{c.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {isMember && (
        <Button variant="emergency" className="hidden md:inline-flex" onClick={() => openReportLeak(buildingId)}>
          <ExclamationTriangleIcon data-icon="inline-start" />
          Report a leak
        </Button>
      )}
    </header>
  )
}

function MobileLeakButton() {
  const pathname = usePathname()
  const { user } = useDemoStore()
  const { openReportLeak } = useReportLeak()
  if (user.role === "staff") return null
  const buildingId = pathname.startsWith("/buildings/") ? pathname.split("/")[2] : undefined
  return (
    <Button
      variant="emergency"
      size="lg"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 h-12 rounded-full px-5 shadow-lg md:hidden"
      onClick={() => openReportLeak(buildingId)}
    >
      <ExclamationTriangleIcon data-icon="inline-start" />
      Report a leak
    </Button>
  )
}

export function ShellSkeleton() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="hidden w-64 flex-col gap-3 border-r p-4 md:flex">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}

export function PortalShell({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { hydrated, user } = useDemoStore()

  const wrongArea =
    user && ((user.role === "staff" && pathname.startsWith("/dashboard")) || (user.role !== "staff" && pathname.startsWith("/staff")))

  useEffect(() => {
    if (!hydrated) return
    if (!user) router.replace("/login")
    else if (wrongArea) router.replace(homeFor(user))
  }, [hydrated, user, wrongArea, router])

  if (!hydrated || !user || wrongArea) return <ShellSkeleton />

  return (
    <SidebarProvider>
      <ReportLeakProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <Header />
          <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
          <MobileLeakButton />
        </SidebarInset>
        <LiveNotifier />
      </ReportLeakProvider>
    </SidebarProvider>
  )
}
