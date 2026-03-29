"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react"
import { DASHBOARD_CHANGED_EVENT } from "@/components/dashboard/events"

type Tx = {
  id: string
  name?: string
  amount: number
  date: string
  type?: "income" | "expense"
}

function monthLabel(date: Date) {
  return date.toLocaleString("pt-BR", { month: "short" })
}

function buildMonths(count = 6) {
  const months: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(monthLabel(d))
  }
  return months
}

export function CashFlowChart() {
  const [data, setData] = useState<Array<{ month: string; income: number; expenses: number }>>(
    buildMonths(6).map((m) => ({ month: m, income: 0, expenses: 0 }))
  )

  async function fetchData() {
    try {
      const res = await fetch("/api/dashboard/transactions/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({}),
      })

      if (!res.ok) {
        console.error("Failed to fetch transactions for chart:", res.status)
        return
      }

      const body = await res.json().catch(() => ({}))
      const items: Tx[] = body.transactions || []

      const months = buildMonths(6)
      const map: Record<string, { income: number; expenses: number }> = {}
      months.forEach((m) => (map[m] = { income: 0, expenses: 0 }))

      items.forEach((tx) => {
        const raw = (tx as any).dateIso || tx.date
        const d = new Date(raw)
        if (isNaN(d.getTime())) return
        const label = monthLabel(new Date(d.getFullYear(), d.getMonth(), 1))
        if (!(label in map)) return

        if (tx.type === "income") {
          map[label].income += Number(tx.amount ?? 0)
        } else if (tx.type === "expense") {
          map[label].expenses += Number(tx.amount ?? 0)
        } else {
          // fallback: use sign
          const amt = Number(tx.amount ?? 0)
          if (amt >= 0) map[label].income += amt
          else map[label].expenses += Math.abs(amt)
        }
      })

      setData(months.map((m) => ({ month: m, income: map[m].income, expenses: map[m].expenses })))
    } catch (error) {
      console.error("Error fetching chart transactions:", error)
    }
  }

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    fetchData()

    function onDashboardChanged() {
      fetchData()
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
        <CardTitle className="text-2xl">Fluxo de Caixa</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={false} name="Receitas" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={false} name="Despesas" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
