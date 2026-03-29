"use client"

import type React from "react"

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

interface NewExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewExpenseModal({ isOpen, onClose }: NewExpenseModalProps) {
  // keep hooks at top to follow React rules
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    const payload = {
      title: String(fd.get("expense-title") ?? "").trim(),
      amount: Number(fd.get("expense-amount") ?? 0),
      date: String(fd.get("expense-date") ?? new Date().toISOString()),
      category: String(fd.get("expense-category") ?? "").trim(),
      description: String(fd.get("expense-description") ?? "").trim(),
    }

    // authentication is handled via HttpOnly cookie set at login; avoid relying on localStorage
    fetch("/api/dashboard/add/outcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error("Failed to add expense:", data)
          alert(data.error || data.message || "Erro ao adicionar despesa")
          return
        }
        // success: notify dashboard listeners then close
        try {
          const { notifyDashboardChanged } = await import("@/components/dashboard/events")
          notifyDashboardChanged()
        } catch (e) {
          try {
            window.dispatchEvent(new Event("dashboard:changed"))
          } catch (e) {
            /* ignore */
          }
        }
        onClose()
      })
      .catch((err) => {
        console.error("Network error adding expense:", err)
        alert("Erro de rede ao enviar. Tente novamente.")
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">Nova Despesa</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="expense-title" className="text-sm font-medium">
              Título
            </Label>
            <Input id="expense-title" name="expense-title" placeholder="ex.: Supermercado, Conta de Internet" className="bg-background" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-amount" className="text-sm font-medium">
              Valor
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                id="expense-amount"
                name="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7 bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-date" className="text-sm font-medium">
              Data
            </Label>
            <div>
              <DatePicker selected={selectedDate} onSelect={setSelectedDate} placeholder="Escolha a data" />
              <input type="hidden" name="expense-date" value={selectedDate ? selectedDate.toISOString() : ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-category" className="text-sm font-medium">
              Categoria
            </Label>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groceries">Alimentação</SelectItem>
                  <SelectItem value="utilities">Serviços públicos</SelectItem>
                  <SelectItem value="entertainment">Entretenimento</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                  <SelectItem value="healthcare">Saúde</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="expense-category" value={selectedCategory} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description" className="text-sm font-medium">
              Descrição (Opcional)
            </Label>
            <textarea
              id="expense-description"
              name="expense-description"
              placeholder="Adicione observações..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Adicionar Despesa
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
