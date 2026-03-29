"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { DASHBOARD_CHANGED_EVENT } from "@/components/dashboard/events"

export function StatsCards() {
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({}),
        })

        if (!res.ok) {
          console.error("Failed to fetch dashboard data:", res.status)
          const errBody = await res.text().catch(() => "")
          console.debug("dashboard error body:", errBody)
          return
        }

        const data = await res.json().catch(() => ({}))

        if (!mounted) return
        setBalance(Number(data.balance ?? 0))
        setIncome(Number(data.income ?? 0))
        setExpenses(Number(data.expenses ?? 0))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchData()

    function onDashboardChanged() {
      // refetch when dashboard changes elsewhere
      fetchData()
    }
    window.addEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)

    return () => {
      mounted = false
      window.removeEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    }
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Saldo Atual</p>
          <p className="text-4xl font-bold">R${balance.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Receitas</p>
          <p className="text-4xl font-bold mb-2">R${income.toFixed(2)}</p>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <TrendingUp className="h-5 w-5" />
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Despesas</p>
          <p className="text-4xl font-bold mb-2">R${expenses.toFixed(2)}</p>
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="h-5 w-5" />
            <TrendingUp className="h-5 w-5" />
            <TrendingDown className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCards
