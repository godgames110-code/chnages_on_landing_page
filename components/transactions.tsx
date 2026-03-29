"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DASHBOARD_CHANGED_EVENT } from "@/components/dashboard/events"

type Tx = { id: string; name?: string; amount: number; date: string; type?: "income" | "expense"; category?: string }

export function Transactions({ count = 5 }: { count?: number }) {
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchTransactions() {
    setLoading(true)
    try {
      const res = await fetch("/api/dashboard/transactions/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({}),
      })

      if (!res.ok) {
        console.error("Failed to fetch transactions for list:", res.status)
        setTransactions([])
        return
      }

      const body = await res.json().catch(() => ({}))
  const items: Tx[] = body.transactions || []
  // Ensure items are sorted newest-first (desc by date) before slicing. Use dateIso when available.
  items.sort((a, b) => new Date((b as any).dateIso || b.date).getTime() - new Date((a as any).dateIso || a.date).getTime())
  setTransactions(items.slice(0, count))
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    fetchTransactions()

    function onDashboardChanged() {
      fetchTransactions()
    }

    window.addEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    return () => {
      mounted = false
      window.removeEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    }
  }, [count])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Transações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Carregando...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem transações ainda.</p>
        ) : (
          <div className="w-full overflow-auto">
            <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead>Transação</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{transaction.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.category || "-"}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="text-right">
                    <p className="text-lg font-bold whitespace-nowrap">{transaction.amount > 0 ? "" : "-"}R${Math.abs(transaction.amount).toFixed(2)}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Transactions
