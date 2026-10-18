"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BuildingOffice2Icon, BuildingOfficeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useDemoStore } from "@/lib/demo-store"
import { DEMO_PERSONAS, getUser } from "@/lib/mock/users"

const PERSONA_ICONS = {
  "u-owner": BuildingOfficeIcon,
  "u-pm": BuildingOffice2Icon,
  "u-staff": WrenchScrewdriverIcon,
}

export function homeFor(user) {
  return user?.role === "staff" ? "/staff" : "/dashboard"
}

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  const { signIn } = useDemoStore()
  const [loading, setLoading] = useState(false)

  const enterAs = (userId) => {
    setLoading(true)
    signIn(userId)
    router.push(homeFor(getUser(userId)))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // Demo: any credentials sign in as the property manager.
    enterAs("u-pm")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-display text-3xl tracking-wide">Welcome to NobleCare</CardTitle>
          <CardDescription>Log in to see your roofs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="you@company.com" />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="********" />
              </Field>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Spinner data-icon="inline-start" />}
                {loading ? "Logging in..." : "Log in"}
              </Button>
              <FieldSeparator>Or try a demo account</FieldSeparator>
              <div className="grid gap-2">
                {DEMO_PERSONAS.map((persona) => {
                  const Icon = PERSONA_ICONS[persona.userId]
                  return (
                    <Button
                      key={persona.userId}
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-auto justify-start gap-3 px-3 py-2.5"
                      disabled={loading}
                      onClick={() => enterAs(persona.userId)}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                        <Icon className="size-5" />
                      </span>
                      <span className="flex flex-col items-start gap-0.5">
                        <span>{persona.label}</span>
                        <span className="text-xs font-normal text-muted-foreground">{persona.description}</span>
                      </span>
                    </Button>
                  )
                })}
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground">
        By continuing, you agree to Noble Roofing&apos;s Terms of Service and Privacy Policy.
      </div>
    </div>
  )
}
