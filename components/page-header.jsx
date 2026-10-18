import { cn } from "@/lib/utils"

export function PageHeader({ title, description, actions, children, className }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-display text-4xl leading-none tracking-wide">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function PageBody({ children, className }) {
  return <div className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8", className)}>{children}</div>
}
