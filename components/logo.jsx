import Image from "next/image"

import { cn } from "@/lib/utils"

// Noble Roofing house mark with the NobleCare product name.
export function Logo({ className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image src="/brand/noble-roofing-mark.png" alt="" width={208} height={213} className="size-8 shrink-0 object-contain" />
      <div className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-wide">NobleCare</span>
        <span className="text-[0.65rem] text-muted-foreground">by Noble Roofing</span>
      </div>
    </div>
  )
}

// Full Noble Roofing wordmark, for the login screen.
export function BrandLogo({ className }) {
  return (
    <Image
      src="/brand/noble-roofing-logo.png"
      alt="Noble Roofing"
      width={1001}
      height={213}
      priority
      className={cn("h-auto w-56", className)}
    />
  )
}
