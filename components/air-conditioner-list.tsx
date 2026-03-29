"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, AlertCircle, CheckCircle, Eye, Edit2, Trash2, Plus, Clock } from "lucide-react"
import ServiceHistoryModal from "@/components/service-history-modal"
import AirConditionerFormModal from "@/components/air-conditioner-form-modal"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import AddActivityModal from "@/components/add-activity-modal"
import MultipleACSelectionModal from "@/components/multiple-ac-selection-modal"
import ServiceFormModal from "@/components/service-form-modal"
import type { AirConditioner, ServiceRecord } from "@/types/air-conditioner"

// Re-export types for backward compatibility
export type { AirConditioner, ServiceRecord }

// Move type declaration here, outside the component
type ServiceRecordWithTypeAndDate = Omit<ServiceRecord, "date" | "type" | "description" | "technician"> & {
  type?: ServiceRecord["type"] | string
  service_type?: string
  date?: string
  service_date?: string
  description?: string
  technician?: string
}

const DEFAULT_SERVICE_TYPE: ServiceRecord["type"] = "manutenção"
const DEFAULT_SERVICE_DATE = new Date().toISOString().split("T")[0]

const SERVICE_TYPE_MAP: Record<string, ServiceRecord["type"]> = {
  limpeza: "limpeza",
  manutenção: "manutenção",
  manutencao: "manutenção",
  reparo: "reparo",
  inspeção: "inspeção",
  inspecao: "inspeção",
  cleaning: "limpeza",
  preventive: "manutenção",
  corrective: "reparo",
  emergency: "reparo",
}

interface AirConditionerListProps {
  airConditioners: AirConditioner[]
  pmocId: string // Adicione o id do PMOC como prop
}

const statusConfig = {
  operational: {
    label: "Operacional",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  "maintenance-pending": {
    label: "Manutenção Pendente",
    icon: AlertCircle,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  "out-of-service": {
    label: "Fora de Serviço",
    icon: AlertCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
}

export default function AirConditionerList({ airConditioners: initialACs, pmocId }: AirConditionerListProps) {
  // Use sempre o array recebido via prop, que já tem serviceHistory
  const [airConditioners, setAirConditioners] = useState(initialACs)
  const [selectedAC, setSelectedAC] = useState<AirConditioner | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showMultipleACModal, setShowMultipleACModal] = useState(false)
  const [selectedACs, setSelectedACs] = useState<string[]>([])
  const [editingAC, setEditingAC] = useState<AirConditioner | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; acId: string | null }>({
    open: false,
    acId: null,
  })
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null)
  const [showServiceFormModal, setShowServiceFormModal] = useState(false)
  const [deleteServiceConfirmation, setDeleteServiceConfirmation] = useState<{
    open: boolean
    serviceId: string | null
  }>({
    open: false,
    serviceId: null,
  })

  const handleViewHistory = (ac: AirConditioner) => {
    setSelectedAC(ac)
    setShowHistoryModal(true)
  }

  const handleCreateNew = () => {
    setEditingAC(null)
    setShowFormModal(true)
  }

  const handleEdit = (ac: AirConditioner) => {
    setEditingAC(ac)
    setShowFormModal(true)
  }

  const handleDeleteClick = (acId: string) => {
    setDeleteConfirmation({ open: true, acId })
  }

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.acId) {
      try {
        const res = await fetch(
          `/api/pmoc/${pmocId}/air-conditioners/${deleteConfirmation.acId}`,
          { method: "DELETE" }
        )
        if (!res.ok) throw new Error("Erro ao deletar ar-condicionado")
        setAirConditioners(airConditioners.filter((ac) => ac.id !== deleteConfirmation.acId))
      } catch (error) {
        console.error(error)
      }
      setDeleteConfirmation({ open: false, acId: null })
    }
  }

  const handleSaveAC = async (acData: Omit<AirConditioner, "id" | "serviceHistory">) => {
    if (editingAC) {
      console.log("PUT URL:", `/api/pmoc/${pmocId}/air-conditioners/${editingAC.id}`)
      console.log("PUT DATA:", acData)
      try {
        const res = await fetch(
          `/api/pmoc/${pmocId}/air-conditioners/${editingAC.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(acData),
          }
        )
        if (!res.ok) throw new Error("Erro ao atualizar ar-condicionado")
        const updatedAC = await res.json()
        setAirConditioners(
          airConditioners.map((ac) => (ac.id === editingAC.id ? updatedAC : ac))
        )
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const res = await fetch(`/api/pmoc/${pmocId}/air-conditioners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(acData),
        })
        if (!res.ok) throw new Error("Erro ao criar ar-condicionado")
        const newAC = await res.json()
        setAirConditioners([...airConditioners, newAC])
      } catch (error) {
        console.error(error)
      }
    }
    setShowFormModal(false)
    setEditingAC(null)
  }

  const handleAddActivity = (ac: AirConditioner) => {
    setSelectedAC(ac)
    setShowActivityModal(true)
  }

  const handleAddMultipleActivities = () => {
    setShowMultipleACModal(true)
  }

  const handleConfirmMultipleSelection = (selectedIds: string[]) => {
    setSelectedACs(selectedIds)
    setShowMultipleACModal(false)
    setShowActivityModal(true)
  }

  const handleSaveActivity = async (activity: ServiceRecord) => {
    if (selectedAC) {
      try {
        const response = await fetch(`/api/pmoc/${pmocId}/air-conditioners/${selectedAC.id}/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...activity,
            pmoc_id: pmocId,
          }),
        });
        if (!response.ok) throw new Error("Erro ao criar serviço");
        const newService = await response.json();
        setAirConditioners(
          airConditioners.map((ac) => {
            if (ac.id === selectedAC.id) {
              return {
                ...ac,
                serviceHistory: [...(ac.serviceHistory || []), newService],
                lastService: newService.date,
              };
            }
            return ac;
          })
        );
      } catch (error) {
        console.error(error);
      }
    }
    setShowActivityModal(false);
    setSelectedAC(null);
  }

  const handleSaveActivityMultiple = async (activity: ServiceRecord) => {
    try {
      // Para múltiplos ACs, faz uma requisição para cada um
      const responses = await Promise.all(
        selectedACs.map(async (acId) => {
          return fetch(`/api/pmoc/${pmocId}/air-conditioners/${acId}/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...activity,
              pmoc_id: pmocId,
            }),
          });
        })
      );
      if (responses.some((res) => !res.ok)) {
        throw new Error("Erro ao criar serviços em múltiplos ACs");
      }
      const newServices = await Promise.all(responses.map((res) => res.json()));
      // Assume newServices is an array of created services, one per AC
      const updatedACs = airConditioners.map((ac) => {
        if (selectedACs.includes(ac.id)) {
          const createdService = Array.isArray(newServices)
            ? newServices.find((s) => s.air_conditioner_id === ac.id)
            : null;
          return {
            ...ac,
            serviceHistory: [...(ac.serviceHistory || []), createdService || activity],
            lastService: (createdService || activity).date,
          };
        }
        return ac;
      });
      setAirConditioners(updatedACs);
    } catch (error) {
      console.error(error);
    }
    setShowActivityModal(false);
    setSelectedAC(null);
    setSelectedACs([]);
  }

  const handleEditService = (service: ServiceRecord) => {
    setEditingService(service)
    setShowServiceFormModal(true)
  }

  const handleDeleteService = (serviceId: string) => {
    setDeleteServiceConfirmation({ open: true, serviceId })
  }

  const handleConfirmDeleteService = () => {
    if (deleteServiceConfirmation.serviceId && selectedAC) {
      setAirConditioners(
        airConditioners.map((ac) => {
          if (ac.id === selectedAC.id) {
            return {
              ...ac,
              serviceHistory: (ac.serviceHistory || []).filter((s) => s.id !== deleteServiceConfirmation.serviceId),
            }
          }
          return ac
        }),
      )
      setSelectedAC((prev) =>
        prev
          ? {
              ...prev,
              serviceHistory: (prev.serviceHistory || []).filter((s) => s.id !== deleteServiceConfirmation.serviceId),
            }
          : null,
      )
      setDeleteServiceConfirmation({ open: false, serviceId: null })
    }
  }

  const handleSaveService = (serviceData: ServiceRecord) => {
    if (selectedAC) {
      const updatedACs = airConditioners.map((ac) => {
        if (ac.id === selectedAC.id) {
          const updatedHistory = editingService
            ? (ac.serviceHistory || []).map((s) => (s.id === editingService.id ? serviceData : s))
            : [...(ac.serviceHistory || []), serviceData]
          return {
            ...ac,
            serviceHistory: updatedHistory,
            lastService: serviceData.date,
          }
        }
        return ac
      })
      setAirConditioners(updatedACs)
      setSelectedAC((prev) =>
        prev
          ? {
              ...prev,
              serviceHistory: editingService
                ? (prev.serviceHistory || []).map((s) => (s.id === editingService.id ? serviceData : s))
                : [...(prev.serviceHistory || []), serviceData],
            }
          : null,
      )
    }
    setShowServiceFormModal(false)
    setEditingService(null)
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 xs:flex-row xs:justify-between xs:items-center w-full">
        <h2 className="text-xl font-semibold text-foreground">Ar-Condicionados</h2>
        <div className="flex flex-col gap-2 xs:flex-row xs:gap-2 w-full xs:w-auto">
          <Button onClick={handleAddMultipleActivities} variant="outline" className="gap-2 bg-transparent w-full xs:w-auto text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Adicionar Serviço em Múltiplos</span>
            <span className="inline xs:hidden">Serviço em Vários</span>
          </Button>
          <Button onClick={handleCreateNew} className="gap-2 w-full xs:w-auto text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Novo Ar-Condicionado</span>
            <span className="inline xs:hidden">Novo AC</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {airConditioners.map((ac) => {
          const config = statusConfig[ac.status as keyof typeof statusConfig]
          const StatusIcon = config.icon

          return (
            <Card key={ac.id} className="p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{ac.brand}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{ac.model}</p>
                </div>
                <Badge variant="outline" className={`${config.className} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </Badge>
              </div>

              <div className="border-t border-border mb-4"></div>

              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Localização</p>
                  <p className="text-sm font-medium text-foreground mt-1">{ac.location}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Identificador</p>
                  <p className="text-xs font-mono text-foreground mt-1">{ac.serialNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Capacidade</p>
                  <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {ac.capacity}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Instalação</p>
                    <p className="text-xs font-medium text-foreground mt-1">
                      {new Date(ac.installationDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Último Serviço</p>
                    <p className="text-xs font-medium text-foreground mt-1">
                      {new Date(ac.lastService).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button onClick={() => handleViewHistory(ac)} variant="outline" size="sm" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Histórico
                </Button>
                <Button onClick={() => handleAddActivity(ac)} variant="outline" size="sm" className="w-full gap-2">
                  <Clock className="w-4 h-4" />
                  Adicionar Atividade
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(ac)} variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(ac.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedAC && (
          <ServiceHistoryModal
          airConditioner={selectedAC}
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false)
            setSelectedAC(null)
            }}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            services={
            Array.isArray(selectedAC.serviceHistory)
              ? selectedAC.serviceHistory.map((service: ServiceRecordWithTypeAndDate) =>
                  normalizeServiceRecord(service)
                )
              : []
            }
          />
          )}

          <AirConditionerFormModal
          isOpen={showFormModal}
          onClose={() => {
          setShowFormModal(false)
          setEditingAC(null)
        }}
        onSave={handleSaveAC}
        initialData={editingAC || undefined}
      />

      <MultipleACSelectionModal
        isOpen={showMultipleACModal}
        airConditioners={airConditioners}
        onClose={() => setShowMultipleACModal(false)}
        onConfirm={handleConfirmMultipleSelection}
      />

      {selectedAC && selectedACs.length === 0 && (
        <AddActivityModal
          airConditioner={selectedAC}
          isOpen={showActivityModal}
          onClose={() => {
            setShowActivityModal(false)
            setSelectedAC(null)
          }}
          onSave={handleSaveActivity}
        />
      )}

      {selectedACs.length > 0 && (
        <AddActivityModal
          airConditioner={{
            id: "multiple",
            brand: `${selectedACs.length} Ar-Condicionados Selecionados`,
            model: "",
            serialNumber: "",
            location: "",
            capacity: "",
            installationDate: "",
            lastService: "",
            status: "operational",
          }}
          isOpen={showActivityModal}
          onClose={() => {
            setShowActivityModal(false)
            setSelectedACs([])
          }}
          onSave={handleSaveActivityMultiple}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.open}
        title="Deletar Ar-Condicionado"
        description="Tem certeza que deseja deletar este ar-condicionado? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmation({ open: false, acId: null })}
      />

      <DeleteConfirmationDialog
        isOpen={deleteServiceConfirmation.open}
        title="Deletar Serviço"
        description="Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDeleteService}
        onCancel={() => setDeleteServiceConfirmation({ open: false, serviceId: null })}
      />

      <ServiceFormModal
        isOpen={showServiceFormModal}
        onClose={() => {
          setShowServiceFormModal(false)
          setEditingService(null)
        }}
        onSave={handleSaveService}
        initialData={editingService || undefined}
      />
    </>
  )
}

function normalizeServiceRecord(service: ServiceRecordWithTypeAndDate): ServiceRecord {
  const typeValue = (service.type || service.service_type || "").toString().toLowerCase()
  const normalizedType = SERVICE_TYPE_MAP[typeValue] || DEFAULT_SERVICE_TYPE
  const normalizedDate = service.date || service.service_date || DEFAULT_SERVICE_DATE

  return {
    id: service.id,
    date: normalizedDate,
    type: normalizedType,
    description: service.description || "",
    technician: service.technician || "",
    status: service.status,
    proof: service.proof,
  }
}
