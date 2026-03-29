"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  selected?: Date
  onSelect: (d?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ selected, onSelect, placeholder = "Escolha uma data", className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`data-[empty=${!selected}]:text-muted-foreground justify-start ${className || "w-full"}`}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
