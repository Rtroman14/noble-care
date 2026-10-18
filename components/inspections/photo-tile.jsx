"use client"

import { useState } from "react"
import {
  ArrowsPointingOutIcon,
  CameraIcon,
  CloudIcon,
  CubeIcon,
  FunnelIcon,
  Square3Stack3DIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Placeholder imagery until real inspection photos (CompanyCam) are wired in.
const KINDS = {
  overview: { icon: Square3Stack3DIcon, tone: "from-sky-900/80 to-slate-700/80" },
  drain: { icon: FunnelIcon, tone: "from-slate-700/80 to-zinc-500/80" },
  seam: { icon: ArrowsPointingOutIcon, tone: "from-zinc-600/80 to-stone-400/80" },
  flashing: { icon: WrenchIcon, tone: "from-stone-700/80 to-amber-700/60" },
  penetration: { icon: CubeIcon, tone: "from-slate-600/80 to-slate-400/80" },
  ponding: { icon: CloudIcon, tone: "from-cyan-900/80 to-sky-600/70" },
}

export function PhotoPlaceholder({ kind, className, iconClassName }) {
  const { icon: Icon, tone } = KINDS[kind] ?? { icon: CameraIcon, tone: "from-zinc-700 to-zinc-500" }
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-white/80", tone, className)}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgb(255_255_255/0.05)_14px_15px)]" />
      <Icon className={cn("relative size-8", iconClassName)} />
    </div>
  )
}

export function PhotoTile({ photo, meta }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col gap-1.5 text-left outline-none"
      >
        <PhotoPlaceholder kind={photo.kind} className="aspect-[4/3] w-full rounded-lg transition-opacity group-hover:opacity-90 group-focus-visible:ring-3 group-focus-visible:ring-ring/50" />
        <span className="line-clamp-2 text-xs text-muted-foreground">{photo.caption}</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{photo.caption}</DialogTitle>
            {meta && <DialogDescription>{meta}</DialogDescription>}
          </DialogHeader>
          <PhotoPlaceholder kind={photo.kind} className="aspect-[4/3] w-full rounded-lg" iconClassName="size-14" />
        </DialogContent>
      </Dialog>
    </>
  )
}
