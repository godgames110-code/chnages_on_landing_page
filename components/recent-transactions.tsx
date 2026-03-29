"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Minus } from "lucide-react"
import { useState, useEffect } from "react"
import type { Transaction } from "@/types/transaction"
import { DASHBOARD_CHANGED_EVENT } from "@/components/dashboard/events"

async function fetchRecentTransactions() {
  try {
    const res = await fetch("/api/dashboard/transactions/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      console.error("Failed to fetch recent transactions:", res.status)
      const errBody = await res.text().catch(() => "")
      console.debug("recent transactions error body:", errBody)
      return []
    }

    const data = await res.json().catch(() => ({}))
    return data.transactions || []
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }
}

interface RecentTransactionsProps {
  onSelectTransaction?: (transaction: Transaction | null) => void
}

export function RecentTransactions({ onSelectTransaction }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Array<{
    id: string
    name: string
    amount: number
    date: string
    type: "income" | "expense"
  }>>([])

  // compute a list of the 5 most recent transactions (sorted by date desc)
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date((b as any).dateIso || b.date).getTime() - new Date((a as any).dateIso || a.date).getTime())
    .slice(0, 5)
  
  useEffect(() => {
    let mounted = true

    fetchRecentTransactions()
      .then((items) => {
        if (!mounted) return
        setTransactions(items)
      })
      .catch((err) => console.error("fetchRecentTransactions failed:", err))

    function onDashboardChanged() {
      fetchRecentTransactions()
        .then((items) => {
          if (!mounted) return
          setTransactions(items)
        })
        .catch((err) => console.error("fetchRecentTransactions failed:", err))
    }

    window.addEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)

    return () => {
      mounted = false
      window.removeEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    }
  }, [])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.map((transaction) => (
          <button
            key={transaction.id}
            onClick={() => onSelectTransaction?.(transaction as unknown as Transaction)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {transaction.type === "income" ? <Check className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
              </div>

              <div className="flex-1">
                <p className="font-semibold">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>

              <p className={`text-lg font-bold ${transaction.amount > 0 ? "text-foreground" : "text-foreground"}`}>
                {transaction.amount > 0 ? "" : "-"}{`R$${Math.abs(transaction.amount).toFixed(2)}`}
              </p>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
