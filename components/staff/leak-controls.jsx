"use client"

import { useEffect, useState } from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { useDemoStore } from "@/lib/demo-store"
import { CREWS, getStep } from "@/lib/leaks"

const DISPATCH_STEP = 4

// Staff panel for moving a leak to its next step. Each update shows up live
// on the member's timeline.
export function LeakControls({ leak }) {
  const { advanceLeak, markLeakSeen, user } = useDemoStore()
  const [crew, setCrew] = useState(leak.crew)
  const [note, setNote] = useState("")

  useEffect(() => {
    if (leak.isNew) markLeakSeen(leak.id)
  }, [leak.id, leak.isNew, markLeakSeen])

  if (leak.step >= 7) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-success" />
            Resolved
          </CardTitle>
          <CardDescription>This leak is closed. The report is posted for the member.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const next = getStep(leak.step + 1)
  const needsCrew = next.step === DISPATCH_STEP && !crew
  const crewItems = [{ label: "Choose a crew", value: null }, ...CREWS.map((c) => ({ label: c.name, value: c.id }))]

  const advance = () => {
    const crewName = CREWS.find((c) => c.id === crew)?.name
    const defaultNote =
      next.key === "acknowledged"
        ? `${user.name} is coordinating.`
        : next.key === "dispatched"
          ? `${crewName} en route.`
          : next.description
    advanceLeak(leak.id, next.step, { note: note.trim() || defaultNote, crew })
    setNote("")
    toast.add({ type: "success", title: `Marked "${next.title}"`, description: `${leak.id} · the member sees this now.` })
  }

  return (
    <Card className="ring-2 ring-primary/20">
      <CardHeader>
        <CardTitle>Update the member</CardTitle>
        <CardDescription>Next step: {next.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="crew">Crew</FieldLabel>
            <Select items={crewItems} value={crew} onValueChange={setCrew}>
              <SelectTrigger id="crew" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {crewItems.map((c) => (
                    <SelectItem key={c.value ?? "none"} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="note">Note to member (optional)</FieldLabel>
            <Input id="note" placeholder={next.description} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={needsCrew} onClick={advance}>
          {needsCrew ? "Choose a crew to dispatch" : `Mark as ${next.title.toLowerCase()}`}
          {!needsCrew && <ArrowRightIcon data-icon="inline-end" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
