'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, Pencil, Trash2, Loader2 } from 'lucide-react'
import type { Appointment, AppointmentStatus } from '@/types/appointment'
import type { Client } from '@/types/client'
import { DashboardHeader } from '@/components/dashboard-header'
import { maskCPFOrCNPJ, maskPhone } from '@/lib/masks'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]
const NO_CLIENT_VALUE = 'no-client'

const statusStyles: Record<AppointmentStatus, { label: string; badge: string; chip: string; icon: string; iconText: string }> = {
  scheduled: {
    label: 'Agendado',
    badge: 'bg-amber-100 text-amber-700',
    chip: 'bg-primary/10 text-primary',
    icon: 'bg-primary/10',
    iconText: 'text-primary',
  },
  confirmed: {
    label: 'Confirmado',
    badge: 'bg-sky-100 text-sky-700',
    chip: 'bg-sky-100 text-sky-700',
    icon: 'bg-sky-100',
    iconText: 'text-sky-700',
  },
  canceled: {
    label: 'Cancelado',
    badge: 'bg-rose-100 text-rose-700',
    chip: 'bg-rose-100 text-rose-700',
    icon: 'bg-rose-100',
    iconText: 'text-rose-700',
  },
  completed: {
    label: 'Concluido',
    badge: 'bg-green-100 text-green-700',
    chip: 'bg-green-100 text-green-700',
    icon: 'bg-green-100',
    iconText: 'text-green-600',
  },
}

const normalizeTimeValue = (value: string | null | undefined) => {
  if (!value) return ''
  return value.length >= 5 ? value.slice(0, 5) : value
}

const normalizeAppointment = (appointment: any): Appointment => {
  const status = (appointment?.status || 'scheduled') as AppointmentStatus
  const rawClientId = appointment?.clientId ?? appointment?.client_id ?? null
  const clientId = rawClientId === null || rawClientId === undefined ? '' : String(rawClientId)
  const rawClientName = appointment?.clientName ?? appointment?.client_name ?? null
  const hasClientName = rawClientName !== null && rawClientName !== undefined && String(rawClientName).trim() !== ''
  const clientName = hasClientName ? String(rawClientName) : (clientId ? 'Cliente' : 'Sem cliente')
  return {
    id: String(appointment?.id ?? ''),
    clientId,
    clientName,
    date: appointment?.date ?? '',
    time: appointment?.time ?? '',
    address: appointment?.address ?? '',
    description: appointment?.description ?? '',
    status,
  }
}

const normalizeClient = (client: any): Client => ({
  id: String(client?.id ?? ''),
  name: client?.name ?? 'Cliente',
  address: client?.address ?? '',
  phone: client?.phone ?? '',
  email: client?.email ?? '',
})

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useExistingClient, setUseExistingClient] = useState(true)
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientDocument, setNewClientDocument] = useState('')
  const [formData, setFormData] = useState({
    clientId: '',
    date: '',
    time: '',
    address: '',
    description: '',
    status: 'scheduled' as AppointmentStatus,
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Recarregar agendamentos quando o mês muda
  useEffect(() => {
    loadCalendarData()
  }, [currentDate])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      // Carregar clientes e agendamentos em paralelo
      const [clientsResponse, appointmentsResponse] = await Promise.all([
        fetch('/api/clients'),
        fetch(`/api/appointments/calendar/${month + 1}/${year}`)
      ])

      const clientsData = await clientsResponse.json().catch(() => [])
      const appointmentsData = await appointmentsResponse.json().catch(() => [])

      if (!clientsResponse.ok) {
        throw new Error(clientsData?.error || 'Erro ao carregar clientes')
      }

      if (!appointmentsResponse.ok) {
        throw new Error(appointmentsData?.error || 'Erro ao carregar agendamentos')
      }

      setClients(Array.isArray(clientsData) ? clientsData.map(normalizeClient) : [])
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData.map(normalizeAppointment) : [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados. Tente recarregar a página.')
    } finally {
      setLoading(false)
    }
  }

  const loadCalendarData = async () => {
    try {
      const response = await fetch(`/api/appointments/calendar/${month + 1}/${year}`)
      const data = await response.json().catch(() => [])
      if (response.ok) {
        setAppointments(Array.isArray(data) ? data.map(normalizeAppointment) : [])
      }
    } catch (error) {
      console.error('Erro ao carregar calendário:', error)
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getAppointmentsForDate = (date: string) => {
    return Array.isArray(appointments) ? appointments.filter(a => a.date === date) : []
  }

  const formatDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const handleOpenModal = (appointment?: Appointment, date?: string) => {
    if (appointment) {
      setEditingAppointment(appointment)
      setUseExistingClient(true)
      setFormData({
        clientId: appointment.clientId,
        date: appointment.date,
        time: normalizeTimeValue(appointment.time),
        address: appointment.address || '',
        description: appointment.description || '',
        status: appointment.status || 'scheduled',
      })
    } else {
      setEditingAppointment(null)
      setUseExistingClient(true)
      setNewClientName('')
      setNewClientPhone('')
      setNewClientEmail('')
      setNewClientDocument('')
      // Definir data mínima como hoje
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        clientId: '',
        date: date || today,
        time: '',
        address: '',
        description: '',
        status: 'scheduled',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAppointment(null)
    setSelectedDate(null)
    setUseExistingClient(true)
    setNewClientName('')
    setNewClientPhone('')
    setNewClientEmail('')
    setNewClientDocument('')
  }

  const handleClientModeChange = (value: string) => {
    const useExisting = value === 'existing'
    setUseExistingClient(useExisting)
    setFormData({ ...formData, clientId: '' })
    if (useExisting) {
      setNewClientName('')
      setNewClientPhone('')
      setNewClientEmail('')
      setNewClientDocument('')
    }
  }

  const removeMask = (value: string) => value.replace(/\D/g, '')

  const resolvePersonType = (document: string) => {
    const digits = removeMask(document)
    return digits.length > 11 ? 'PJ' : 'PF'
  }

  const newClientDocumentDigits = removeMask(newClientDocument)
  const isNewClientCnpj = newClientDocumentDigits.length > 11

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!useExistingClient && (!newClientName || !newClientPhone)) {
      alert('Informe nome e telefone do cliente')
      return
    }

    try {
      setSubmitting(true)

      let clientId = formData.clientId

      if (!useExistingClient) {
        const documentDigits = removeMask(newClientDocument)
        const clientResponse = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newClientName,
            phone: removeMask(newClientPhone),
            email: newClientEmail || null,
            person_type: resolvePersonType(documentDigits),
            document: documentDigits || null,
          }),
        })

        const clientData = await clientResponse.json().catch(() => ({}))
        if (!clientResponse.ok) {
          alert(clientData?.error || 'Erro ao criar cliente')
          return
        }

        clientId = String(clientData.id)
        setClients((prev) => [
          ...prev,
          normalizeClient(clientData),
        ])
        setFormData({ ...formData, clientId })
      }
      
      // Preparar dados para a API (ajustar nomes dos campos)
      const resolvedClientId = clientId ? Number(clientId) : null
      const appointmentData = {
        client_id: resolvedClientId,
        date: formData.date,
        time: formData.time,
        address: formData.address,
        description: formData.description,
        status: formData.status,
      }

      if (editingAppointment) {
        // Editar agendamento
        const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        })
        const data = await response.json().catch(() => ({}))
        if (response.ok) {
          // Recarregar dados do calendário
          await loadCalendarData()
          handleCloseModal()
        } else {
          alert(data?.error || 'Erro ao atualizar agendamento')
        }
      } else {
        // Criar novo agendamento
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        })
        const data = await response.json().catch(() => ({}))
        if (response.ok) {
          // Recarregar dados do calendário
          await loadCalendarData()
          handleCloseModal()
        } else {
          alert(data?.error || 'Erro ao criar agendamento')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      alert('Erro ao salvar agendamento')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        // Recarregar dados do calendário
        await loadCalendarData()
      } else {
        alert(data?.error || 'Erro ao excluir agendamento')
      }
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      alert('Erro ao excluir agendamento')
    }
  }

  const handleClientChange = (clientId: string) => {
    if (clientId === NO_CLIENT_VALUE) {
      setFormData({
        ...formData,
        clientId: '',
      })
      return
    }

    const client = clients.find(c => c.id === clientId)
    setFormData({
      ...formData,
      clientId,
      address: client?.address || formData.address,
    })
  }

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const today = new Date().toISOString().split('T')[0]

  // Mostrar loading enquanto carrega dados iniciais
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">Carregando agendamentos</p>
              <p className="text-sm text-muted-foreground mt-1">Buscando dados do calendario...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <p className="text-foreground font-semibold text-lg">Erro ao carregar agendamentos</p>
            <p className="text-muted-foreground text-sm mt-2 mb-6">{error}</p>
            <Button onClick={loadInitialData} className="bg-primary hover:bg-primary/90">
              Tentar Novamente
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Agendamentos</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Gerencie sua agenda de serviços
              </p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              size="lg"
              className="gap-2 w-full sm:w-auto text-base sm:text-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Novo Agendamento</span>
              <span className="inline xs:hidden">Agendar</span>
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {MONTHS[month]} {year}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-2" />
                }
                const dateString = formatDateString(day)
                const dayAppointments = getAppointmentsForDate(dateString)
                const isToday = dateString === today
                const hasAppointments = dayAppointments.length > 0

                return (
                  <div
                    key={day}
                    className={`min-h-24 p-2 border border-border rounded-xl cursor-pointer transition-colors ${
                      isToday ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                    } ${selectedDate === dateString ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedDate(dateString)}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                      {day}
                    </div>
                    {hasAppointments && (
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${statusStyles[apt.status]?.chip || statusStyles.scheduled.chip}`}
                          >
                            {normalizeTimeValue(apt.time)} - {apt.clientName}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayAppointments.length - 2} mais
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {selectedDate && (
          <Card className="rounded-2xl shadow-sm bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Agendamentos - {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                </CardTitle>
                <Button
                  onClick={() => handleOpenModal(undefined, selectedDate)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {getAppointmentsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getAppointmentsForDate(selectedDate).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/30"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusStyles[apt.status]?.icon || statusStyles.scheduled.icon}`}>
                          <Clock className={`w-5 h-5 ${statusStyles[apt.status]?.iconText || statusStyles.scheduled.iconText}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-foreground">{apt.clientName}</p>
                            <p className="text-sm text-muted-foreground">{normalizeTimeValue(apt.time)}</p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[apt.status]?.badge || statusStyles.scheduled.badge}`}>
                            {statusStyles[apt.status]?.label || statusStyles.scheduled.label}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{apt.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {apt.address}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(apt)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(apt.id)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento para esta data
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="rounded-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente (opcional)</Label>
                <Tabs
                  value={useExistingClient ? 'existing' : 'new'}
                  onValueChange={handleClientModeChange}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
                    <TabsTrigger value="new">Novo Cliente</TabsTrigger>
                  </TabsList>

                  <TabsContent value="existing" className="space-y-3 mt-4">
                    <Select value={formData.clientId || NO_CLIENT_VALUE} onValueChange={handleClientChange}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecione o cliente (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NO_CLIENT_VALUE}>Sem cliente</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>

                  <TabsContent value="new" className="space-y-3 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-client-name">Nome do Cliente *</Label>
                      <Input
                        id="new-client-name"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Nome do cliente"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-client-phone">Telefone *</Label>
                      <Input
                        id="new-client-phone"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(maskPhone(e.target.value))}
                        placeholder="(11) 98765-4321"
                        className="rounded-xl"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-client-email">Email (Opcional)</Label>
                      <Input
                        id="new-client-email"
                        type="email"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        placeholder="cliente@exemplo.com"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-client-document">CPF/CNPJ (Opcional)</Label>
                      <Input
                        id="new-client-document"
                        value={newClientDocument}
                        onChange={(e) => setNewClientDocument(maskCPFOrCNPJ(e.target.value))}
                        placeholder="000.000.000-00"
                        className="rounded-xl"
                        inputMode="numeric"
                      />
                      {isNewClientCnpj && (
                        <p className="text-xs text-amber-600">
                          CNPJ detectado. O cliente sera criado como PJ.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço do serviço"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Serviço</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o serviço a ser realizado"
                  className="rounded-xl resize-none"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: AppointmentStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="completed">Concluido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="rounded-xl"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-xl bg-primary hover:bg-primary/90"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </div>
                  ) : (
                    editingAppointment ? 'Salvar' : 'Agendar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
