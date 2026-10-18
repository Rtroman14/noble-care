export const MEMBERS = [
  { id: "m-whitfield", name: "Whitfield Holdings" },
  { id: "m-gulfline", name: "Gulfline Property Group" },
  { id: "m-bayou", name: "Bayou City Logistics" },
]

export const USERS = [
  {
    id: "u-owner",
    name: "Dana Whitfield",
    email: "dana@whitfieldholdings.com",
    role: "owner",
    title: "Building owner",
    memberId: "m-whitfield",
    initials: "DW",
  },
  {
    id: "u-pm",
    name: "Marcus Reyes",
    email: "marcus@gulflinepg.com",
    role: "pm",
    title: "Property manager",
    memberId: "m-gulfline",
    initials: "MR",
  },
  {
    id: "u-staff",
    name: "Lyn Carter",
    email: "lyn@nobleroofing.com",
    role: "staff",
    title: "Noble service coordinator",
    memberId: null,
    initials: "LC",
  },
]

export const DEMO_PERSONAS = [
  { userId: "u-owner", label: "Building owner", description: "One building" },
  { userId: "u-pm", label: "Property manager", description: "Five-building portfolio" },
  { userId: "u-staff", label: "Noble staff", description: "Requests and alerts" },
]

export function getUser(id) {
  return USERS.find((u) => u.id === id) ?? null
}

export function getMember(id) {
  return MEMBERS.find((m) => m.id === id) ?? null
}
