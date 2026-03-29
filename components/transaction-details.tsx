"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notifyDashboardChanged } from "@/components/dashboard/events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { X, Calendar, Tag, FileText, DollarSign } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import type { Transaction } from "@/types/transaction"

interface TransactionDetailsProps {
  transaction: Transaction
  onClose: () => void
  onEdit?: () => void
}

export function TransactionDetails({ transaction, onClose, onEdit }: TransactionDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDeleteConfirmed() {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/transactions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transaction.id }),
      })

      if (res.ok) {
        // notify dashboard components first (so listeners are still mounted), then close modal
        try { notifyDashboardChanged() } catch (e) { /* ignore */ }
        onClose()
        // Force a full page reload so the UI is guaranteed to reflect the deletion
        try { setTimeout(() => { try { window.location.reload() } catch (e) { /* ignore */ } }, 50) } catch (e) { /* ignore */ }
      } else {
        const err = await res.json().catch(() => ({}))
        console.error("Failed to delete transaction:", err)
        // optionally show toast
      }
    } catch (e) {
      console.error("Error deleting transaction:", e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl min-w-0 truncate">Detalhes da Transação</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Amount */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Valor</p>
            <p className={`text-4xl font-bold ${transaction.type === "income" ? "text-primary" : "text-red-600"}`}>
              {transaction.amount > 0 ? "+" : "-"}{`R$${Math.abs(transaction.amount).toFixed(2)}`}
            </p>
          </div>
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              transaction.type === "income" ? "bg-primary/10" : "bg-red-100"
            }`}
          >
            <DollarSign className={`h-8 w-8 ${transaction.type === "income" ? "text-primary" : "text-red-600"}`} />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Nome da Transação</span>
          </div>
          <p className="text-lg font-semibold pl-6 break-words">{transaction.name}</p>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Data</span>
          </div>
          <p className="text-lg pl-6">{transaction.date}</p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-medium">Categoria</span>
          </div>
          <div className="pl-6">
            <span className="inline-block max-w-full break-words px-3 py-1 rounded-full text-sm font-medium bg-muted">
              {transaction.category}
            </span>
          </div>
        </div>

        {/* Description */}
        {transaction.description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Descrição</span>
            </div>
            <p className="text-base pl-6 text-muted-foreground break-words">{transaction.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onEdit?.()}>
              Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1" disabled={loading}>
                {loading ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os dados relacionados a esta transação serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleDeleteConfirmed}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
