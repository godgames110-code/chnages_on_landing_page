"use client"

import type { FormEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { useState } from "react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import type { Transaction } from "@/types/transaction"
import { notifyDashboardChanged } from "@/components/dashboard/events"
import { useToast } from "@/hooks/use-toast"
import { mapCategoryToOptionValue } from "@/lib/utils"

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
  // use shared helper from lib/utils

  const [formData, setFormData] = useState<{
    name: string
    amount: number
    date: string
    category: string
    description: string
  }>({
    name: transaction.name,
    amount: Math.abs(transaction.amount),
    date: transaction.date,
    // map backend category -> select option value so the correct option is selected
    category: mapCategoryToOptionValue(transaction.type, transaction.category),
    description: transaction.description || "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!isOpen) return null

  const isIncome = transaction.type === "income"
  // debug logs removed

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        id: transaction.id,
        name: formData.name,
        amount: formData.amount,
        date: formData.date,
        category: formData.category,
        description: formData.description,
        type: transaction.type,
      }

      const res = await fetch("/api/dashboard/transactions/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        try { notifyDashboardChanged() } catch (e) { /* ignore */ }
        toast({ title: "Transação atualizada", description: "As alterações foram salvas." })
        onClose()
      } else {
        console.error("Failed to edit transaction:", data)
        toast({ title: "Falha ao salvar", description: String(data.error || data.message || "Erro") })
      }
    } catch (err) {
      console.error("Error editing transaction:", err)
      toast({ title: "Erro", description: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    } as any))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">
            Editar {isIncome ? "Receita" : "Despesa"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Título
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: Salário, Compras"
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Valor
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="pl-7 bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Data
            </Label>
            <Input
              id="date"
              name="date"
              type="text"
              value={formData.date}
              onChange={handleChange}
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Categoria
            </Label>
            <div>
              <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {isIncome ? (
                    <>
                      <SelectItem value="salary">Salário</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="investment">Investimentos</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="groceries">Alimentação</SelectItem>
                      <SelectItem value="utilities">Serviços públicos</SelectItem>
                      <SelectItem value="transportation">Transporte</SelectItem>
                      <SelectItem value="shopping">Compras</SelectItem>
                      <SelectItem value="healthcare">Saúde</SelectItem>
                      <SelectItem value="entertainment">Entretenimento</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição (Opcional)
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Adicione observações..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`flex-1 text-white ${
                isIncome ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90"
              }`}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
