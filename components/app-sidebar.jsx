"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowPathIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingOffice2Icon,
  ChevronUpDownIcon,
  CloudIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  InboxStackIcon,
  ShieldExclamationIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { homeFor } from "@/components/login-form"
import { toast } from "@/components/ui/toast"
import { useDemoStore, useVisibleBuildings, useVisibleLeaks, useVisibleStormAlerts } from "@/lib/demo-store"
import { isLeakOpen } from "@/lib/leaks"
import { DEMO_PERSONAS, getMember, getUser } from "@/lib/mock/users"

function NavItem({ href, icon: Icon, label, badge, exact }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={label}
        render={<Link href={href} onClick={() => setOpenMobile(false)} />}
      >
        <Icon />
        <span>{label}</span>
      </SidebarMenuButton>
      {badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  )
}

function MemberNav() {
  const buildings = useVisibleBuildings()
  const openLeaks = useVisibleLeaks().filter(isLeakOpen).length
  const alerts = useVisibleStormAlerts().length
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Your roofs</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavItem href="/dashboard" icon={Squares2X2Icon} label="Dashboard" />
            {buildings.length > 1 ? (
              <NavItem href="/buildings" icon={BuildingOffice2Icon} label="Buildings" badge={buildings.length} />
            ) : (
              buildings[0] && (
                <NavItem href={`/buildings/${buildings[0].id}`} icon={BuildingOffice2Icon} label="My building" />
              )
            )}
            <NavItem href="/leaks" icon={ShieldExclamationIcon} label="Leak reports" badge={openLeaks || null} />
            <NavItem href="/alerts" icon={CloudIcon} label="Storm alerts" badge={alerts || null} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Coming soon</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <NavItem href="/proposals" icon={DocumentCheckIcon} label="Repair proposals" />
            <NavItem href="/billing" icon={CreditCardIcon} label="Billing" />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

function StaffNav() {
  const { leaks } = useDemoStore()
  const open = leaks.filter(isLeakOpen).length
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Noble operations</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <NavItem href="/staff" icon={InboxStackIcon} label="Request queue" badge={open || null} exact />
          <NavItem href="/staff/storms" icon={CloudIcon} label="Storm center" />
          <NavItem href="/buildings" icon={BuildingOffice2Icon} label="All buildings" />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function UserMenu() {
  const router = useRouter()
  const { user, signIn, signOut, resetDemo } = useDemoStore()
  const { isMobile } = useSidebar()
  const org = user.memberId ? getMember(user.memberId)?.name : "Noble Roofing"

  const switchTo = (userId) => {
    signIn(userId)
    router.push(homeFor(getUser(userId)))
    window.scrollTo({ top: 0 })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuButton size="lg" />}
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{org}</span>
        </div>
        <ChevronUpDownIcon className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end" className="min-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch demo user</DropdownMenuLabel>
          {DEMO_PERSONAS.map((p) => (
            <DropdownMenuItem key={p.userId} disabled={p.userId === user.id} onClick={() => switchTo(p.userId)}>
              <UserCircleIcon />
              <div className="flex flex-col">
                <span>{getUser(p.userId).name}</span>
                <span className="text-xs text-muted-foreground">{p.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              resetDemo()
              toast.add({ title: "Demo data reset", description: "Leaks and alerts are back to the starting state." })
            }}
          >
            <ArrowPathIcon />
            Reset demo data
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut()
              router.push("/login")
            }}
          >
            <ArrowRightStartOnRectangleIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppSidebar(props) {
  const { user } = useDemoStore()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href={homeFor(user)} />}>
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{user.role === "staff" ? <StaffNav /> : <MemberNav />}</SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
