"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Loader2 } from "lucide-react"
import CreateServiceDialog from "@/components/create-service-dialog"
import ServicesList from "@/components/services-list"
import EditServiceDialog from "@/components/edit-service-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import ServiceDetailsModal from "@/components/service-details-modal"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"

const serviceCategories = [
  { value: "limpeza", label: "Limpeza" },
  { value: "manutencao", label: "Manutenção" },
  { value: "reparo", label: "Reparo" },
  { value: "inspecao", label: "Inspeção" },
  { value: "instalacao", label: "Instalação" },
]

export default function ServicosPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const { toast } = useToast()

  // Fetch services from backend
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/services')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar serviços')
        }
        
        const data = await response.json()
        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching services:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar serviços')
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os serviços. Tente novamente.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [toast])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      (service.name || service.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || '').toLowerCase().includes(searchTerm.toLowerCase())

    let matchesTab = true
    if (activeTab === "all") {
      matchesTab = service.status === "scheduled" || service.status === "agendado"
    } else if (activeTab === "completed") {
      matchesTab = service.status === "completed" || service.status === "concluido"
    }

    return matchesSearch && matchesTab
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    const dateA = new Date(a.scheduled_date || a.datetime || a.created_at).getTime()
    const dateB = new Date(b.scheduled_date || b.datetime || b.created_at).getTime()
    return dateA - dateB
  })

  const handleCreateService = async (newService: any) => {
    try {
      const response = await fetch(`/api/pmoc/${newService.pmoc_id}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar serviço')
      }

      const createdService = await response.json()
      setServices([...services, createdService])
      setIsCreateDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso.",
      })
    } catch (err) {
      console.error('Error creating service:', err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o serviço. Tente novamente.",
      })
    }
  }

  const handleEditService = async (updatedService: any) => {
    try {
      const response = await fetch(`/api/services/${updatedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar serviço')
      }

      const updated = await response.json()
      setServices(services.map((s) => (s.id === updated.id ? updated : s)))
      setIsEditDialogOpen(false)
      setEditingService(null)
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso.",
      })
    } catch (err) {
      console.error('Error updating service:', err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o serviço. Tente novamente.",
      })
    }
  }

  const handleDeleteService = async () => {
    if (!serviceToDelete) return

    try {
      const response = await fetch(`/api/services/${serviceToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar serviço')
      }

      setServices(services.filter((s) => s.id !== serviceToDelete.id))
      setShowDeleteConfirm(false)
      setServiceToDelete(null)
      toast({
        title: "Sucesso",
        description: "Serviço deletado com sucesso.",
      })
    } catch (err) {
      console.error('Error deleting service:', err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deletar o serviço. Tente novamente.",
      })
    }
  }

  const handleOpenEdit = (service: any) => {
    setEditingService(service)
    setIsEditDialogOpen(true)
  }

  const handleOpenDelete = (service: any) => {
    setServiceToDelete(service)
    setShowDeleteConfirm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
              <p className="text-sm text-muted-foreground mt-1">Gerencie seus serviços agendados e concluídos</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Novo Serviço
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground text-lg">Carregando serviços...</p>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-destructive text-lg mb-2">Erro ao carregar serviços</p>
            <p className="text-muted-foreground">{error}</p>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, serviço ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">
                  Todos os Serviços
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1 sm:flex-none">
                  Concluídos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <ServicesList
                services={sortedServices}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onViewDetails={setSelectedService}
              />
              {sortedServices.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Nenhum serviço encontrado.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <ServicesList
                services={sortedServices}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onViewDetails={setSelectedService}
              />
              {sortedServices.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Nenhum serviço concluído ainda.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateService}
        categories={serviceCategories}
      />

      {editingService && (
        <EditServiceDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleEditService}
          service={editingService}
          categories={serviceCategories}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Deletar Serviço"
        description={`Tem certeza que deseja deletar o serviço "${serviceToDelete?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteService}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ServiceDetailsModal
        service={selectedService}
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
      />
    </div>
  )
}
