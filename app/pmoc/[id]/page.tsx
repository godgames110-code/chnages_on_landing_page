"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, MapPin, Zap, Edit2, Trash2, Play, CheckCircle, Loader2, FileText, CalendarDays, Building2, User, Wrench, Clock, ChevronRight } from "lucide-react"
import CompanyRepresentativeCard from "@/components/company-representative-card"
import { maskCNPJ, maskPhone } from "@/lib/masks"
import AirConditionerList from "@/components/air-conditioner-list"
import TaskFormModal from "@/components/task-form-modal"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import FinishTaskModal from "@/components/finish-task-modal"
import AllTasksList from "@/components/all-tasks-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { generateLaudoPdf, type LaudoData } from "@/lib/laudo-pdf"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const statusConfig = {
  active: {
    label: "Ativo",
    className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-500/15 text-amber-700 border-amber-500/25",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Concluido",
    className: "bg-sky-500/15 text-sky-700 border-sky-500/25",
    dot: "bg-sky-500",
  },
}

const taskStatusConfig = {
  iniciar: {
    label: "Iniciar",
    className: "bg-muted text-muted-foreground",
  },
  "em-andamento": {
    label: "Em Andamento",
    className: "bg-sky-500/15 text-sky-700 border-sky-500/25",
  },
  finalizada: {
    label: "Finalizada",
    className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
  },
}

export default function PMOCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [pmoc, setPmoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"acs" | "tasks" | "all-tasks" | "laudos">("acs")
  const [editingTask, setEditingTask] = useState<any>(null)
  const [technicianData, setTechnicianData] = useState<any>(null)
  const [laudoCleaningDate, setLaudoCleaningDate] = useState(new Date().toISOString().split("T")[0])
  const [laudoReportDate, setLaudoReportDate] = useState(new Date().toISOString().split("T")[0])
  const [generatingLaudo, setGeneratingLaudo] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [taskToFinish, setTaskToFinish] = useState<any>(null)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const { toast } = useToast()
  const [pmocId, setPmocId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPmocData() {
      try {
        setLoading(true)
        setError(null)
        const { id } = await params
        setPmocId(id)
        const pmocResponse = await fetch(`/api/pmoc/${id}`)
        if (!pmocResponse.ok) throw new Error("Erro ao carregar PMOC")
        const pmocData = await pmocResponse.json()

        let clientData = null
        if (pmocData.client_id) {
          const clientResponse = await fetch(`/api/clients/${pmocData.client_id}`)
          if (clientResponse.ok) clientData = await clientResponse.json()
        }

        const acsResponse = await fetch(`/api/pmoc/${id}/air-conditioners`)
        const acsData = acsResponse.ok ? await acsResponse.json() : []

        const servicesResponse = await fetch(`/api/pmoc/${id}/services`)
        const servicesData = servicesResponse.ok ? await servicesResponse.json() : []

        const airConditionersWithServices = (Array.isArray(acsData) ? acsData : []).map((ac: any) => ({
          ...ac,
          serviceHistory: (Array.isArray(servicesData) ? servicesData : []).filter(
            (service: any) => service.air_conditioner_id === ac.id
          ),
        }))

        const pmocComplete = {
          ...pmocData,
          airConditioners: airConditionersWithServices,
          company: {
            name: clientData?.name || pmocData.building_name || "Empresa",
            cnpj: clientData?.document || "00.000.000/0000-00",
            representative: {
              name: clientData?.name || "Nao informado",
              phone: clientData?.phone || "(00) 00000-0000",
              photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientData?.name || "Default"}`,
            },
            address: pmocData.address || "",
            city: pmocData.city || "",
            state: pmocData.state || "",
            zipCode: pmocData.zip_code || "",
            phone: clientData?.phone || "(00) 0000-0000",
          },
        }
        setPmoc(pmocComplete)
      } catch (err) {
        console.error("Error fetching PMOC data:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar PMOC")
        toast({ variant: "destructive", title: "Erro", description: "Nao foi possivel carregar os dados do PMOC." })
      } finally {
        setLoading(false)
      }
    }
    fetchPmocData()
  }, [params, toast])

  useEffect(() => {
    async function fetchTechnician() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) setTechnicianData(await res.json())
      } catch (err) {
        console.error("Erro ao buscar dados do tecnico:", err)
      }
    }
    fetchTechnician()
  }, [])

  const handleGenerateLaudo = () => {
    if (!pmoc || !technicianData) {
      toast({ variant: "destructive", title: "Erro", description: "Dados do PMOC ou do tecnico nao disponiveis." })
      return
    }
    setGeneratingLaudo(true)
    try {
      const equipmentMap = new Map<string, { quantity: number; capacity: string; location: string }>()
      const acs = pmoc.airConditioners || []
      acs.forEach((ac: any) => {
        const key = `${ac.capacity || "N/A"}-${ac.location || "N/A"}`
        if (equipmentMap.has(key)) {
          equipmentMap.get(key)!.quantity += 1
        } else {
          equipmentMap.set(key, { quantity: 1, capacity: ac.capacity || "N/A", location: ac.location || "N/A" })
        }
      })
      const laudoData: LaudoData = {
        clientName: pmoc.company?.name || pmoc.building_name || "Nao informado",
        clientDocument: pmoc.company?.cnpj || "Nao informado",
        serviceAddress: [pmoc.company?.address, pmoc.company?.city, pmoc.company?.state, pmoc.company?.zipCode].filter(Boolean).join(", ") || pmoc.location || "Nao informado",
        cleaningDate: laudoCleaningDate,
        reportDate: laudoReportDate,
        companyName: technicianData.technician?.companyName || "Nao informado",
        companyDocument: technicianData.technician?.companyDocument || "Nao informado",
        technicianName: technicianData.name || "Nao informado",
        technicianRegistration: technicianData.technician?.technicalRegistration || "Nao informado",
        technicianCpf: technicianData.technician?.cpf || "Nao informado",
        companyLogoUrl: technicianData.technician?.companyLogoUrl || null,
        equipments: Array.from(equipmentMap.values()),
      }
      generateLaudoPdf(laudoData)
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao gerar o laudo tecnico." })
    } finally {
      setGeneratingLaudo(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">Carregando PMOC</p>
              <p className="text-sm text-muted-foreground mt-1">Buscando dados do plano...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !pmoc) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-10 text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-destructive" />
            </div>
            <p className="text-foreground font-semibold text-lg">Erro ao carregar PMOC</p>
            <p className="text-muted-foreground text-sm mt-2 mb-6">{error || "PMOC nao encontrado"}</p>
            <Link href="/pmoc">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para PMOCs
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const config = statusConfig[pmoc.status as keyof typeof statusConfig] || statusConfig.active

  const getPendingActivities = () => {
    const allActs: Array<{ ac: string; acName: string; acId: string; activity: any }> = []
    pmoc.airConditioners.forEach((ac: any) => {
      ac.serviceHistory?.forEach((service: any) => {
        if (!service.status || service.status !== "finalizada") {
          allActs.push({ ac: ac.id, acId: ac.id, acName: `${ac.brand} - ${ac.location}`, activity: service })
        }
      })
    })
    return allActs
  }

  const pendingActivities = getPendingActivities()

  const updateTaskStatus = (acId: string, taskId: string, newStatus: string) => {
    setPmoc((prev: any) => ({
      ...prev,
      airConditioners: prev.airConditioners.map((ac: any) =>
        ac.id === acId
          ? { ...ac, serviceHistory: ac.serviceHistory.map((s: any) => (s.id === taskId ? { ...s, status: newStatus } : s)) }
          : ac
      ),
    }))
  }

  const deleteTask = (acId: string, taskId: string) => {
    setPmoc((prev: any) => ({
      ...prev,
      airConditioners: prev.airConditioners.map((ac: any) =>
        ac.id === acId ? { ...ac, serviceHistory: ac.serviceHistory.filter((s: any) => s.id !== taskId) } : ac
      ),
    }))
    setShowDeleteConfirm(false)
    setTaskToDelete(null)
  }

  const handleEditTask = (updatedTask: any, acId: string) => {
    setPmoc((prev: any) => ({
      ...prev,
      airConditioners: prev.airConditioners.map((ac: any) =>
        ac.id === acId ? { ...ac, serviceHistory: ac.serviceHistory.map((s: any) => (s.id === updatedTask.id ? updatedTask : s)) } : ac
      ),
    }))
    setShowTaskModal(false)
    setEditingTask(null)
  }

  const handleFinishTask = (updatedTask: any, proofUrl: string | undefined, acId: string) => {
    setPmoc((prev: any) => ({
      ...prev,
      airConditioners: prev.airConditioners.map((ac: any) =>
        ac.id === acId
          ? {
              ...ac,
              serviceHistory: ac.serviceHistory.map((s: any) =>
                s.id === updatedTask.id
                  ? { ...s, status: "finalizada", proof: proofUrl ? [...(s.proof || []), { fileName: "Comprovante", url: proofUrl, type: "image" as const }] : s.proof || [] }
                  : s
              ),
            }
          : ac
      ),
    }))
    setShowFinishModal(false)
    setTaskToFinish(null)
  }

  const getAllActivities = () => {
    const all: any[] = []
    pmoc.airConditioners.forEach((ac: any) => {
      ac.serviceHistory?.forEach((service: any) => {
        all.push({ ac: ac.id, acName: `${ac.brand} - ${ac.location}`, activity: service })
      })
    })
    return all
  }

  const allActivities = getAllActivities()

  const tabs = [
    { id: "acs" as const, label: "Ar-condicionados", icon: Zap, count: pmoc.airConditioners?.length || 0 },
    { id: "tasks" as const, label: "Pendentes", icon: Clock, count: pendingActivities.length },
    { id: "all-tasks" as const, label: "Todas as Tarefas", icon: Wrench, count: allActivities.length },
    { id: "laudos" as const, label: "Laudos", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <DashboardHeader />

      {/* Hero Header */}
      <div className="bg-card border-b border-border w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/pmoc" className="hover:text-foreground transition-colors">PMOCs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate">{pmoc.building_name}</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground text-balance">{pmoc.building_name}</h1>
                  <Badge variant="outline" className={`${config.className} gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                  </Badge>
                </div>
                {pmoc.location && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{pmoc.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleGenerateLaudo}
                disabled={generatingLaudo || !technicianData}
              >
                {generatingLaudo ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Gerar Laudo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        {/* Summary Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {/* Representante */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Representante</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{pmoc.company.representative.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{pmoc.company.representative.role}</p>
              </div>
            </div>
          </Card>

          {/* Empresa */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Empresa</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{pmoc.company.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{maskCNPJ(pmoc.company.cnpj || "")}</p>
              </div>
            </div>
          </Card>

          {/* Equipamentos */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipamentos</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{pmoc.airConditioners?.length || 0}</p>
                <p className="text-xs text-muted-foreground">unidade(s) de AC</p>
              </div>
            </div>
          </Card>

          {/* Proxima Manutencao */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prox. Manutencao</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {pmoc.next_maintenance ? new Date(pmoc.next_maintenance).toLocaleDateString("pt-BR") : "Nao informado"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pmoc.last_maintenance ? `Ultima: ${new Date(pmoc.last_maintenance).toLocaleDateString("pt-BR")}` : "Sem registro"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Cards Row */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 mb-6 sm:mb-8">
          {/* Representante Card */}
          <CompanyRepresentativeCard company={pmoc.company} />

          {/* Local da Empresa */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Local da Empresa</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Empresa</p>
                <p className="text-sm font-medium text-foreground mt-1">{pmoc.company.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CNPJ</p>
                <p className="text-sm font-medium text-foreground mt-1">{maskCNPJ(pmoc.company.cnpj || "")}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground">{pmoc.company.address}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pmoc.company.city}, {pmoc.company.state} {pmoc.company.zipCode}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href={`tel:${pmoc.company.phone}`} className="text-primary hover:underline">{maskPhone(pmoc.company.phone || "")}</a>
              </div>
            </div>
          </Card>

          {/* Info do PMOC */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Informacoes do PMOC</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Criado em</p>
                <p className="text-sm font-medium text-foreground mt-1">{new Date(pmoc.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ultima Manutencao</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {pmoc.last_maintenance ? new Date(pmoc.last_maintenance).toLocaleDateString("pt-BR") : "Nao informado"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Proxima Manutencao</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {pmoc.next_maintenance ? new Date(pmoc.next_maintenance).toLocaleDateString("pt-BR") : "Nao informado"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Section */}
        <div>
          <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto pb-px w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Aba Ar-condicionados */}
          {activeTab === "acs" && pmocId && <AirConditionerList airConditioners={pmoc.airConditioners} pmocId={pmocId} />}

          {/* Aba Tarefas Pendentes */}
          {activeTab === "tasks" && (
            <div>
              {pendingActivities.length === 0 ? (
                <Card className="p-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <p className="font-medium text-foreground">Tudo em dia!</p>
                  <p className="text-sm text-muted-foreground mt-1">Nenhuma tarefa pendente no momento.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingActivities.map((item) => {
                    const currentStatus = item.activity.status || "iniciar"
                    const tsc = taskStatusConfig[currentStatus as keyof typeof taskStatusConfig]
                    return (
                      <Card key={`${item.ac}-${item.activity.id}`} className="p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{item.acName}</h3>
                              <Badge variant="outline" className="capitalize text-xs">{item.activity.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.activity.description}</p>
                            <div className="flex items-center gap-4 flex-wrap text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {new Date(item.activity.date).toLocaleDateString("pt-BR")}
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <User className="w-3.5 h-3.5" />
                                {item.activity.technician}
                              </div>
                              <Badge variant="outline" className={`capitalize text-xs ${tsc.className}`}>{tsc.label}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {currentStatus === "iniciar" && (
                              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => updateTaskStatus(item.acId, item.activity.id, "em-andamento")}>
                                <Play className="w-3.5 h-3.5" /> Iniciar
                              </Button>
                            )}
                            {currentStatus === "em-andamento" && (
                              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setTaskToFinish({ ...item.activity, acId: item.acId }); setShowFinishModal(true) }}>
                                <CheckCircle className="w-3.5 h-3.5" /> Finalizar
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingTask({ ...item.activity, acId: item.acId }); setShowTaskModal(true) }}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => { setTaskToDelete({ taskId: item.activity.id, acId: item.acId }); setShowDeleteConfirm(true) }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Aba Todas as Tarefas */}
          {activeTab === "all-tasks" && (
            <AllTasksList
              pmoc={pmoc}
              onEdit={(acId, taskId) => {
                setEditingTask({
                  acId, taskId,
                  task: pmoc.airConditioners.find((ac: any) => ac.id === acId)?.serviceHistory.find((s: any) => s.id === taskId),
                })
                setShowTaskModal(true)
              }}
              onDelete={(acId, taskId) => { setTaskToDelete({ acId, taskId }); setShowDeleteConfirm(true) }}
            />
          )}

          {/* Aba Laudos */}
          {activeTab === "laudos" && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Gerar Laudo Tecnico de Limpeza</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Preencha as datas e gere o laudo tecnico em PDF com os dados deste PMOC.</p>
                  </div>
                </div>

                {/* Informacoes pre-preenchidas */}
                <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-xl bg-muted/40 mb-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{pmoc.company?.name || pmoc.building_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CNPJ do Cliente</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{pmoc.company?.cnpj || "Nao informado"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Endereco</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {[pmoc.company?.address, pmoc.company?.city, pmoc.company?.state].filter(Boolean).join(", ") || pmoc.location || "Nao informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipamentos</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{pmoc.airConditioners?.length || 0} unidade(s) de AC</p>
                  </div>
                </div>

                {/* Info do tecnico */}
                {technicianData?.technician && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dados do Tecnico (automatico)</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <p className="text-foreground"><span className="text-muted-foreground">Nome:</span> {technicianData.name}</p>
                      <p className="text-foreground"><span className="text-muted-foreground">Empresa:</span> {technicianData.technician.companyName}</p>
                      <p className="text-foreground"><span className="text-muted-foreground">CNPJ:</span> {technicianData.technician.companyDocument}</p>
                      <p className="text-foreground"><span className="text-muted-foreground">Registro:</span> {technicianData.technician.technicalRegistration}</p>
                    </div>
                  </div>
                )}

                {!technicianData?.technician && (
                  <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-4 mb-6">
                    <p className="text-sm text-destructive">
                      Voce precisa estar cadastrado como tecnico para gerar laudos. Acesse seu perfil para se registrar.
                    </p>
                  </div>
                )}

                {/* Campos de data */}
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="laudoCleaningDate" className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      Data da Limpeza
                    </Label>
                    <Input id="laudoCleaningDate" type="date" value={laudoCleaningDate} onChange={(e) => setLaudoCleaningDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="laudoReportDate" className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      Data do Laudo
                    </Label>
                    <Input id="laudoReportDate" type="date" value={laudoReportDate} onChange={(e) => setLaudoReportDate(e.target.value)} />
                  </div>
                </div>

                <Button
                  onClick={handleGenerateLaudo}
                  disabled={generatingLaudo || !technicianData?.technician}
                  className="gap-2"
                  size="lg"
                >
                  {generatingLaudo ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
                  ) : (
                    <><FileText className="w-4 h-4" /> Gerar Laudo em PDF</>
                  )}
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>

      {showTaskModal && (
        <TaskFormModal
          task={editingTask}
          onSave={(updatedTask) => handleEditTask(updatedTask, editingTask.acId)}
          onClose={() => { setShowTaskModal(false); setEditingTask(null) }}
        />
      )}

      {showDeleteConfirm && taskToDelete && (
        <DeleteConfirmationDialog
          isOpen={showDeleteConfirm}
          title="Deletar Tarefa"
          description="Tem certeza que deseja deletar esta tarefa? Esta acao nao pode ser desfeita."
          onConfirm={() => deleteTask(taskToDelete.acId, taskToDelete.taskId)}
          onCancel={() => { setShowDeleteConfirm(false); setTaskToDelete(null) }}
        />
      )}

      {showFinishModal && taskToFinish && (
        <FinishTaskModal
          task={taskToFinish}
          acName={
            pmoc.airConditioners.find((ac: any) => ac.id === taskToFinish.acId)?.brand +
            " - " +
            pmoc.airConditioners.find((ac: any) => ac.id === taskToFinish.acId)?.location
          }
          onConfirm={(updatedTask, proofUrl) => handleFinishTask(updatedTask, proofUrl, taskToFinish.acId)}
          onCancel={() => { setShowFinishModal(false); setTaskToFinish(null) }}
        />
      )}
    </div>
  )
}

function getTotalActivities(pmoc: any) {
  let totalActivities = 0
  pmoc.airConditioners.forEach((ac: any) => {
    totalActivities += ac.serviceHistory?.length || 0
  })
  return totalActivities
}

// Mock data - será substituído por dados do backend
