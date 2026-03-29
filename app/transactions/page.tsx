"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { TransactionsFilters } from "@/components/transactions-filters"
import { TransactionsList } from "@/components/transactions-list"
import { TransactionDetails } from "@/components/transaction-details"
import { EditTransactionModal } from "@/components/edit-transaction-modal"
import { useState, useEffect } from "react"
import { DASHBOARD_CHANGED_EVENT } from "@/components/dashboard/events"
import type { Transaction } from "@/types/transaction"

// Transactions loaded from backend proxy
const INITIAL: Transaction[] = []

export default function EntriesPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchTransactions() {
      if (!mounted) return
      setLoading(true)
      try {
        const res = await fetch("/api/dashboard/transactions/list", { method: "POST" })
        const data = await res.json().catch(() => ({}))
        if (!mounted) return
        if (data.transactions) {
          // ensure transactions are ordered newest-first (desc by date)
          const items = Array.isArray(data.transactions) ? (data.transactions as Transaction[]).slice() : []
          // prefer dateIso if provided by the API, otherwise fall back to date
          items.sort((a: Transaction, b: Transaction) => {
            const ta = new Date((b as any).dateIso || b.date).getTime()
            const tb = new Date((a as any).dateIso || a.date).getTime()
            return ta - tb
          })
          setTransactions(items)
          setError(null)
        } else if (data.error) {
          setError(String(data.error))
        } else {
          setTransactions([])
        }
      } catch (err) {
        if (!mounted) return
        setError(String(err))
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchTransactions()

    function onDashboardChanged() {
      fetchTransactions()
    }

    window.addEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)

    return () => {
      mounted = false
      window.removeEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    }
  }, [])

  // Get unique categories from loaded transactions
  const categories = Array.from(new Set(transactions.map((t) => t.category))) as string[]

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Todas as Transações</h1>
          <p className="text-muted-foreground">Veja e filtre todas as suas entradas e saídas</p>
        </div>

        <TransactionsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] mt-6">
          <div>
            {loading ? (
              <p className="text-muted-foreground">Carregando transações…</p>
            ) : error ? (
              <p className="text-destructive">Erro ao carregar transações: {error}</p>
            ) : (
              <TransactionsList
                transactions={filteredTransactions}
                onSelectTransaction={setSelectedTransaction}
                selectedTransactionId={selectedTransaction?.id}
              />
            )}
          </div>

          {selectedTransaction && (
            <div className="hidden lg:block">
              <TransactionDetails
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                onEdit={handleEdit}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile transaction details modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setSelectedTransaction(null)}>
            <div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <TransactionDetails
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                onEdit={handleEdit}
              />
            </div>
        </div>
      )}

      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}

    </div>
  )
}

