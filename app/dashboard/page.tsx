"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { NewIncomeModal } from "@/components/new-income-modal"
import { NewExpenseModal } from "@/components/new-expense-modal"
import { EditTransactionModal } from "@/components/edit-transaction-modal"
import { useState, useEffect } from "react"
import type { Transaction } from "@/types/transaction"
import type { Appointment } from "@/types/appointment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  Clock,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  MapPin
} from "lucide-react"
import { DASHBOARD_CHANGED_EVENT } from "@/components/dashboard/events"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts"

type AppointmentStatus = 'scheduled' | 'confirmed' | 'canceled' | 'completed'

const statusStyles: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
  scheduled: { label: 'Agendado', bg: 'bg-amber-100', text: 'text-amber-700' },
  confirmed: { label: 'Confirmado', bg: 'bg-sky-100', text: 'text-sky-700' },
  canceled: { label: 'Cancelado', bg: 'bg-rose-100', text: 'text-rose-700' },
  completed: { label: 'Concluído', bg: 'bg-green-100', text: 'text-green-700' },
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

export default function DashboardPage() {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Stats
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  
  // Appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  
  // Chart data
  const [chartData, setChartData] = useState<Array<{ month: string; income: number; expenses: number }>>(
    buildMonths(6).map((m) => ({ month: m, income: 0, expenses: 0 }))
  )
  
  // Stats counts
  const [todayAppointments, setTodayAppointments] = useState(0)
  const [weekAppointments, setWeekAppointments] = useState(0)

  // Fetch balance
  useEffect(() => {
    let mounted = true

    async function fetchBalance() {
      try {
        const res = await fetch("/api/dashboard/balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({}),
        })

        if (!res.ok) return

        const data = await res.json().catch(() => ({}))
        if (!mounted) return
        setBalance(Number(data.balance ?? 0))
        setIncome(Number(data.income ?? 0))
        setExpenses(Number(data.expenses ?? 0))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchBalance()
    
    function onDashboardChanged() {
      fetchBalance()
    }
    window.addEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)

    return () => {
      mounted = false
      window.removeEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    }
  }, [])

  // Fetch chart data
  useEffect(() => {
    let mounted = true

    async function fetchChartData() {
      try {
        const res = await fetch("/api/dashboard/transactions/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({}),
        })

        if (!res.ok) return

        const body = await res.json().catch(() => ({}))
        const items = body.transactions || []

        const months = buildMonths(6)
        const map: Record<string, { income: number; expenses: number }> = {}
        months.forEach((m) => (map[m] = { income: 0, expenses: 0 }))

        items.forEach((tx: any) => {
          const raw = tx.dateIso || tx.date
          const d = new Date(raw)
          if (isNaN(d.getTime())) return
          const label = monthLabel(new Date(d.getFullYear(), d.getMonth(), 1))
          if (!(label in map)) return

          if (tx.type === "income") {
            map[label].income += Number(tx.amount ?? 0)
          } else if (tx.type === "expense") {
            map[label].expenses += Number(tx.amount ?? 0)
          }
        })

        if (mounted) {
          setChartData(months.map((m) => ({ month: m, income: map[m].income, expenses: map[m].expenses })))
        }
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    fetchChartData()

    function onDashboardChanged() {
      fetchChartData()
    }
    window.addEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)

    return () => {
      mounted = false
      window.removeEventListener(DASHBOARD_CHANGED_EVENT, onDashboardChanged)
    }
  }, [])

  // Fetch appointments
  useEffect(() => {
    let mounted = true

    async function fetchAppointments() {
      try {
        setAppointmentsLoading(true)
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()
        
        const res = await fetch(`/api/appointments/calendar/${month}/${year}`)
        if (!res.ok) return

        const data = await res.json().catch(() => [])
        if (!mounted) return

        const today = new Date().toISOString().split('T')[0]
        const weekFromNow = new Date()
        weekFromNow.setDate(weekFromNow.getDate() + 7)
        const weekEnd = weekFromNow.toISOString().split('T')[0]

        const appointments = Array.isArray(data) ? data.map((apt: any) => ({
          id: String(apt.id ?? ''),
          clientId: String(apt.clientId ?? apt.client_id ?? ''),
          clientName: apt.clientName ?? apt.client_name ?? 'Cliente',
          date: apt.date ?? '',
          time: apt.time ?? '',
          address: apt.address ?? '',
          description: apt.description ?? '',
          status: (apt.status || 'scheduled') as AppointmentStatus,
        })) : []

        // Filter upcoming appointments (today and future, not canceled/completed)
        const upcoming = appointments
          .filter((apt: Appointment) => apt.date >= today && apt.status !== 'canceled' && apt.status !== 'completed')
          .sort((a: Appointment, b: Appointment) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`)
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`)
            return dateA.getTime() - dateB.getTime()
          })
          .slice(0, 5)

        // Count today's appointments
        const todayCount = appointments.filter((apt: Appointment) => apt.date === today && apt.status !== 'canceled').length
        
        // Count this week's appointments
        const weekCount = appointments.filter((apt: Appointment) => apt.date >= today && apt.date <= weekEnd && apt.status !== 'canceled').length

        setUpcomingAppointments(upcoming)
        setTodayAppointments(todayCount)
        setWeekAppointments(weekCount)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        if (mounted) setAppointmentsLoading(false)
      }
    }

    fetchAppointments()

    return () => {
      mounted = false
    }
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatTime = (time: string | null | undefined) => {
    if (!time) return ''
    return time.length >= 5 ? time.slice(0, 5) : time
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Hoje'
    if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã'
    
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h2>
          <p className="text-muted-foreground text-sm mt-1">Aqui está o resumo do seu negócio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Saldo */}
          <Card className="col-span-2 lg:col-span-1">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Saldo Atual</p>
              <p className="text-xl lg:text-2xl font-bold text-foreground">{formatCurrency(balance)}</p>
            </CardContent>
          </Card>

          {/* Receitas */}
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Receitas</p>
              <p className="text-lg lg:text-2xl font-bold text-foreground">{formatCurrency(income)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Este mês</span>
              </div>
            </CardContent>
          </Card>

          {/* Despesas */}
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Despesas</p>
              <p className="text-lg lg:text-2xl font-bold text-foreground">{formatCurrency(expenses)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600 font-medium">Este mês</span>
              </div>
            </CardContent>
          </Card>

          {/* Agendamentos Hoje */}
          <Card className="hidden lg:block">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">Agendamentos Hoje</p>
              <p className="text-lg lg:text-2xl font-bold text-foreground">{todayAppointments}</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{weekAppointments} esta semana</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Cash Flow Chart */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Fluxo de Caixa</CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    Ver detalhes
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6b7280", fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                      width={50}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="url(#incomeGradient)"
                      name="Receitas"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fill="url(#expenseGradient)"
                      name="Despesas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Receitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Despesas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Próximos Agendamentos</CardTitle>
                <Link href="/appointments">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    Ver todos
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div 
                      key={apt.id}
                      className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{apt.clientName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(apt.date)} {formatTime(apt.time) && `às ${formatTime(apt.time)}`}
                            </span>
                          </div>
                          {apt.address && (
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground truncate">{apt.address}</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusStyles[apt.status].bg} ${statusStyles[apt.status].text}`}>
                          {statusStyles[apt.status].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Nenhum agendamento próximo</p>
                  <Link href="/appointments">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Agendar
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setIsIncomeModalOpen(true)}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nova Receita</span>
                  <span className="sm:hidden">Receita</span>
                </Button>
                <Button 
                  onClick={() => setIsExpenseModalOpen(true)}
                  variant="outline"
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nova Despesa</span>
                  <span className="sm:hidden">Despesa</span>
                </Button>
                <Link href="/appointments">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Novo Agendamento</span>
                    <span className="sm:hidden">Agendar</span>
                  </Button>
                </Link>
                <Link href="/clientes">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Ver Clientes</span>
                    <span className="sm:hidden">Clientes</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NewIncomeModal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} />
      <NewExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />

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
