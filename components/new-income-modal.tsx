"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

interface NewIncomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewIncomeModal({ isOpen, onClose }: NewIncomeModalProps) {
  // keep hooks at top to follow React rules
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // collect form values
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const payload = {
      title: String(fd.get("income-title") ?? "").trim(),
      amount: Number(fd.get("income-amount") ?? 0),
      // prefer selectedDate state (keeps ISO string format used elsewhere)
      date: selectedDate ? selectedDate.toISOString() : String(fd.get("income-date") ?? new Date().toISOString()),
      category: String(fd.get("income-category") ?? "").trim(),
      description: String(fd.get("income-description") ?? "").trim(),
    }

    // client-side call to our frontend API route which proxies to backend
    // authentication is handled via HttpOnly cookie set at login; no need to read token from localStorage
    fetch("/api/dashboard/add/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ensure same-origin credentials (cookies) are sent explicitly
      credentials: "same-origin",
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error("Failed to add income:", data)
          alert(data.error || data.message || "Erro ao adicionar receita")
          return
        }

        // success: notify dashboard listeners then close
        try {
          const { notifyDashboardChanged } = await import("@/components/dashboard/events")
          notifyDashboardChanged()
        } catch (e) {
          // fallback: attempt to use global window event if import fails
          try {
            window.dispatchEvent(new Event("dashboard:changed"))
          } catch (e) {
            /* ignore */
          }
        }
        onClose()
      })
      .catch((err) => {
        console.error("Network error adding income:", err)
        alert("Erro de rede ao enviar. Tente novamente.")
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">Nova Receita</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="income-title" className="text-sm font-medium">
              Título
            </Label>
            <Input id="income-title" name="income-title" placeholder="ex.: Salário, Trabalho Freelance" className="bg-background" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-amount" className="text-sm font-medium">
              Valor
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                id="income-amount"
                name="income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7 bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-date" className="text-sm font-medium">
              Data
            </Label>
            <div>
              <DatePicker selected={selectedDate} onSelect={setSelectedDate} placeholder="Escolha a data" />
              {/* keep a hidden input so form FormData includes the date for the existing submit logic */}
              <input type="hidden" name="income-date" value={selectedDate ? selectedDate.toISOString() : ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-category" className="text-sm font-medium">
              Categoria
            </Label>
            <div>
              {/* Controlled Radix Select - keep a hidden input so FormData includes the value */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salário</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="investment">Investimento</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="income-category" value={selectedCategory} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-description" className="text-sm font-medium">
              Descrição (Opcional)
            </Label>
            <textarea
              id="income-description"
              name="income-description"
              placeholder="Adicione observações..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              Adicionar Receita
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
