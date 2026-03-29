"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

export default function SimpleSelect({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label?: string
  value?: string
  onChange: (v: string) => void
  options: Option[]
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="text-sm text-muted-foreground">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export { SimpleSelect }
