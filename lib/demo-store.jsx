"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { BUILDINGS } from "@/lib/mock/buildings"
import { seedLeaks } from "@/lib/mock/leaks"
import { seedStorms } from "@/lib/mock/storms"
import { getUser } from "@/lib/mock/users"
import { buildingsInStorm } from "@/lib/geo"
import { getStep } from "@/lib/leaks"

// Shared demo data (leaks, alerts) lives in localStorage and is synced across
// tabs with BroadcastChannel. The signed-in demo user is per tab
// (sessionStorage), so a member tab and a staff tab can sit side by side.
const DATA_KEY = "noblecare:data:v1"
const USER_KEY = "noblecare:user"
const LAST_USER_KEY = "noblecare:last-user"
const CHANNEL = "noblecare"

const DemoStoreContext = createContext(null)

// Seeded on mount, not during render: Date.now() can't run while prerendering.
const EMPTY = { leaks: [], storms: [], stormAlerts: [], leakSeq: 0 }

function seedData() {
  const now = Date.now()
  return { leaks: seedLeaks(now), storms: seedStorms(now), stormAlerts: [], leakSeq: 1044 }
}

function read(storage, key) {
  try {
    return window[storage].getItem(key)
  } catch {
    return null
  }
}

function write(storage, key, value) {
  try {
    if (value == null) window[storage].removeItem(key)
    else window[storage].setItem(key, value)
  } catch {}
}

export function DemoStoreProvider({ children }) {
  const [hydrated, setHydrated] = useState(false)
  const [userId, setUserId] = useState(null)
  const [data, setData] = useState(EMPTY)
  const dataRef = useRef(data)
  const channelRef = useRef(null)
  const timersRef = useRef([])

  useEffect(() => {
    let initial = null
    try {
      initial = JSON.parse(read("localStorage", DATA_KEY))
    } catch {}
    dataRef.current = initial ?? seedData()
    setData(dataRef.current)
    setUserId(read("sessionStorage", USER_KEY) ?? read("localStorage", LAST_USER_KEY))
    setHydrated(true)

    if (typeof BroadcastChannel === "undefined") return
    const channel = new BroadcastChannel(CHANNEL)
    channel.onmessage = (e) => {
      if (e.data?.type !== "data") return
      dataRef.current = e.data.data
      setData(e.data.data)
    }
    channelRef.current = channel
    return () => {
      channel.close()
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  const commit = useCallback((updater) => {
    const next = typeof updater === "function" ? updater(dataRef.current) : updater
    dataRef.current = next
    setData(next)
    write("localStorage", DATA_KEY, JSON.stringify(next))
    channelRef.current?.postMessage({ type: "data", data: next })
  }, [])

  const signIn = useCallback((id) => {
    write("sessionStorage", USER_KEY, id)
    write("localStorage", LAST_USER_KEY, id)
    setUserId(id)
  }, [])

  const signOut = useCallback(() => {
    write("sessionStorage", USER_KEY, null)
    write("localStorage", LAST_USER_KEY, null)
    setUserId(null)
  }, [])

  const advanceLeak = useCallback(
    (id, step, { note, crew } = {}) => {
      commit((prev) => ({
        ...prev,
        leaks: prev.leaks.map((leak) => {
          if (leak.id !== id || step <= leak.step) return leak
          const events = [...leak.events]
          for (let s = leak.step + 1; s <= step; s++) {
            events.push({
              step: s,
              at: new Date().toISOString(),
              note: s === step && note ? note : getStep(s).description,
            })
          }
          return { ...leak, step, crew: crew ?? leak.crew, events }
        }),
      }))
    },
    [commit]
  )

  const reportLeak = useCallback(
    ({ buildingId, location, severity, severityNote, notes, reportedBy }) => {
      const now = new Date().toISOString()
      const id = `LK-${dataRef.current.leakSeq}`
      commit((prev) => {
        const leak = {
          id,
          buildingId,
          reportedBy,
          reportedAt: now,
          location,
          severity,
          severityNote,
          notes,
          crew: null,
          step: 1,
          isNew: true,
          events: [{ step: 1, at: now, note: "Reported from the NobleCare app." }],
        }
        return { ...prev, leaks: [leak, ...prev.leaks], leakSeq: prev.leakSeq + 1 }
      })
      // Keep the timeline moving when no staff tab is open.
      timersRef.current.push(
        setTimeout(() => advanceLeak(id, 2, { note: "Paged on-call coordinator and crew lead." }), 2500)
      )
      return id
    },
    [commit, advanceLeak]
  )

  const markLeakSeen = useCallback(
    (id) => {
      commit((prev) => ({
        ...prev,
        leaks: prev.leaks.map((l) => (l.id === id && l.isNew ? { ...l, isNew: false } : l)),
      }))
    },
    [commit]
  )

  const sendStormAlert = useCallback(
    (stormId) => {
      const storm = dataRef.current.storms.find((s) => s.id === stormId)
      const alert = {
        id: `alert-${stormId}-${Date.now()}`,
        stormId,
        sentAt: new Date().toISOString(),
        buildingIds: buildingsInStorm(storm, BUILDINGS).map((b) => b.id),
        acknowledged: {},
      }
      commit((prev) => ({ ...prev, stormAlerts: [alert, ...prev.stormAlerts] }))
      return alert
    },
    [commit]
  )

  const acknowledgeAlert = useCallback(
    (alertId, buildingId) => {
      commit((prev) => ({
        ...prev,
        stormAlerts: prev.stormAlerts.map((a) =>
          a.id === alertId
            ? { ...a, acknowledged: { ...a.acknowledged, [buildingId]: new Date().toISOString() } }
            : a
        ),
      }))
    },
    [commit]
  )

  const resetDemo = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    commit(seedData())
  }, [commit])

  const value = useMemo(
    () => ({
      hydrated,
      user: userId ? getUser(userId) : null,
      ...data,
      signIn,
      signOut,
      reportLeak,
      advanceLeak,
      markLeakSeen,
      sendStormAlert,
      acknowledgeAlert,
      resetDemo,
    }),
    [hydrated, userId, data, signIn, signOut, reportLeak, advanceLeak, markLeakSeen, sendStormAlert, acknowledgeAlert, resetDemo]
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider")
  return ctx
}

export function useCurrentUser() {
  return useDemoStore().user
}

// Buildings the signed-in user can see: their member's buildings, or all for staff.
export function useVisibleBuildings() {
  const { user } = useDemoStore()
  return useMemo(() => {
    if (!user) return []
    if (user.role === "staff") return BUILDINGS
    return BUILDINGS.filter((b) => b.memberId === user.memberId)
  }, [user])
}

export function useVisibleLeaks() {
  const { leaks } = useDemoStore()
  const buildings = useVisibleBuildings()
  return useMemo(() => {
    const ids = new Set(buildings.map((b) => b.id))
    return leaks.filter((l) => ids.has(l.buildingId))
  }, [leaks, buildings])
}

// Alerts touching the user's buildings, each narrowed to just those buildings.
export function useVisibleStormAlerts() {
  const { stormAlerts, storms } = useDemoStore()
  const buildings = useVisibleBuildings()
  return useMemo(() => {
    const ids = new Set(buildings.map((b) => b.id))
    return stormAlerts
      .map((a) => ({
        ...a,
        storm: storms.find((s) => s.id === a.stormId),
        buildingIds: a.buildingIds.filter((id) => ids.has(id)),
      }))
      .filter((a) => a.buildingIds.length > 0)
  }, [stormAlerts, storms, buildings])
}
