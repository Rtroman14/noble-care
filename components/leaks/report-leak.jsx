"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { CameraIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { useDemoStore, useVisibleBuildings } from "@/lib/demo-store"
import { SEVERITIES } from "@/lib/leaks"
import { getPlan } from "@/lib/mock/plans"

const ReportLeakContext = createContext(null)

export function useReportLeak() {
  const ctx = useContext(ReportLeakContext)
  if (!ctx) throw new Error("useReportLeak must be used within ReportLeakProvider")
  return ctx
}

export function ReportLeakProvider({ children }) {
  const [state, setState] = useState({ open: false, buildingId: null, key: 0 })
  const openReportLeak = useCallback(
    (buildingId = null) => setState((s) => ({ open: true, buildingId, key: s.key + 1 })),
    []
  )
  const setOpen = (open) => setState((s) => ({ ...s, open }))

  return (
    <ReportLeakContext.Provider value={{ openReportLeak }}>
      {children}
      <ReportLeakSheet open={state.open} onOpenChange={setOpen} buildingId={state.buildingId} formKey={state.key} />
    </ReportLeakContext.Provider>
  )
}

function ReportLeakSheet({ open, onOpenChange, buildingId, formKey }) {
  const isMobile = useIsMobile()
  const title = "Report a leak"
  const description = "Noble's on-call team is alerted the moment you submit."
  const form = <LeakForm key={formKey} initialBuildingId={buildingId} onDone={() => onOpenChange(false)} />

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-4">{form}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}

function LeakForm({ initialBuildingId, onDone }) {
  const router = useRouter()
  const { user, reportLeak } = useDemoStore()
  const buildings = useVisibleBuildings()
  const [buildingId, setBuildingId] = useState(initialBuildingId ?? (buildings.length === 1 ? buildings[0].id : null))
  const [severity, setSeverity] = useState(["active"])
  const [otherText, setOtherText] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [photo, setPhoto] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const items = [
    { label: "Choose a building", value: null },
    ...buildings.map((b) => ({ label: b.name, value: b.id })),
  ]
  const building = buildings.find((b) => b.id === buildingId)
  const missingBuilding = showErrors && !buildingId
  const isOther = severity[0] === "other"
  const missingOther = showErrors && isOther && !otherText.trim()

  const onSubmit = (e) => {
    e.preventDefault()
    if (!buildingId || (isOther && !otherText.trim())) {
      setShowErrors(true)
      return
    }
    const id = reportLeak({
      buildingId,
      location: location.trim() || "Not specified",
      severity: severity[0] ?? "active",
      severityNote: isOther ? otherText.trim() : undefined,
      notes: notes.trim(),
      reportedBy: user.name,
    })
    onDone()
    const hours = getPlan(building.tier).responseHours
    toast.add({
      type: "success",
      title: "Leak reported. Noble's team has been alerted.",
      description: `${building.name} · response guaranteed within ${hours} hours`,
      timeout: 8000,
      actionProps: { children: "Track progress", onClick: () => router.push(`/leaks/${id}`) },
    })
    router.push(`/leaks/${id}`)
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field data-invalid={missingBuilding || undefined}>
          <FieldLabel htmlFor="leak-building">Building</FieldLabel>
          <Select items={items} value={buildingId} onValueChange={setBuildingId}>
            <SelectTrigger id="leak-building" className="w-full" aria-invalid={missingBuilding || undefined}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value ?? "none"} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {building && (
            <FieldDescription>
              {building.address} · RAMP {getPlan(building.tier).name}, {getPlan(building.tier).responseHours}-hour response
            </FieldDescription>
          )}
          {missingBuilding && <FieldDescription>Choose the building with the leak.</FieldDescription>}
        </Field>
        <Field>
          <FieldLabel>What are you seeing?</FieldLabel>
          <ToggleGroup
            value={severity}
            onValueChange={(v) => v.length && setSeverity(v)}
            variant="outline"
            orientation="vertical"
            className="w-full"
          >
            {Object.entries(SEVERITIES).map(([key, s]) => (
              <ToggleGroupItem key={key} value={key} className="justify-start">
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {isOther && (
            <Input
              autoFocus
              aria-label="Describe what you're seeing"
              aria-invalid={missingOther || undefined}
              placeholder="Describe what you're seeing"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          )}
          {missingOther && <FieldError>Tell us briefly what you&apos;re seeing.</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="leak-location">Where is it?</FieldLabel>
          <Input
            id="leak-location"
            placeholder="e.g. Suite 140, back storeroom"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="leak-notes">Anything else we should know?</FieldLabel>
          <Textarea
            id="leak-notes"
            placeholder="How fast is it dripping? Is anything at risk?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <Button type="button" variant="outline" onClick={() => setPhoto((p) => !p)}>
          {photo ? <CheckCircleIcon data-icon="inline-start" /> : <CameraIcon data-icon="inline-start" />}
          {photo ? "1 photo attached" : "Add a photo"}
        </Button>
      </FieldGroup>
      <DialogFooterOrDrawer>
        <Button type="submit" size="lg" variant="emergency" className="w-full sm:w-auto">
          <ExclamationTriangleIcon data-icon="inline-start" />
          Send leak report
        </Button>
      </DialogFooterOrDrawer>
    </form>
  )
}

function DialogFooterOrDrawer({ children }) {
  const isMobile = useIsMobile()
  if (isMobile) return <DrawerFooter className="px-0 pt-4">{children}</DrawerFooter>
  return <DialogFooter className="mt-4">{children}</DialogFooter>
}
