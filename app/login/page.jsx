import { LoginForm } from "@/components/login-form"
import { BrandLogo } from "@/components/logo"

export const metadata = { title: "Log in · NobleCare" }

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <BrandLogo />
          <p className="text-xs font-bold tracking-widest text-destructive uppercase italic">Service with integrity</p>
        </div>
        <LoginForm className="w-full" />
      </div>
    </div>
  )
}
