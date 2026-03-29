"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Download, Calendar, User, Edit2, Trash2 } from "lucide-react"
import type { AirConditioner, ServiceRecord } from "@/types/air-conditioner"

interface ServiceHistoryModalProps {
  airConditioner: AirConditioner
  isOpen: boolean
  onClose: () => void
  onEdit?: (service: ServiceRecord) => void
  onDelete?: (serviceId: string) => void
  services?: ServiceRecord[]
}

const serviceTypeConfig = {
  limpeza: {
    label: "Limpeza",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  manutenção: {
    label: "Manutenção",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  reparo: {
    label: "Reparo",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  inspeção: {
    label: "Inspeção",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
}

const statusConfig = {
  iniciar: {
    label: "Iniciar",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
  em_andamento: {
    label: "Em andamento",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  finalizada: {
    label: "Finalizada",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
}

export default function ServiceHistoryModal({
  airConditioner,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  services,
}: ServiceHistoryModalProps) {
  const mockHistory: ServiceRecord[] = services || [
    {
      id: "serv-1",
      date: "2025-11-15",
      type: "manutenção",
      status: "finalizada",
      description: "Manutenção preventiva completa, limpeza de filtros e coils",
      technician: "João Silva",
      proof: [
        {
          fileName: "relatorio_manutencao_15-11.pdf",
          url: "#",
          type: "pdf",
        },
        {
          fileName: "foto_antes.jpg",
          url: "#",
          type: "image",
        },
        {
          fileName: "foto_depois.jpg",
          url: "#",
          type: "image",
        },
      ],
    },
    {
      id: "serv-2",
      date: "2025-10-20",
      type: "limpeza",
      status: "em_andamento",
      description: "Limpeza de filtros e ventilador interno",
      technician: "Maria Santos",
      proof: [
        {
          fileName: "comprovante_limpeza_20-10.pdf",
          url: "#",
          type: "pdf",
        },
      ],
    },
  ]

  // LOGS DE DEBUG
  console.log('ServiceHistoryModal - airConditioner:', airConditioner)
  console.log('ServiceHistoryModal - services prop:', services)

  // Garante que não há conflito com window.history
  const serviceHistory = Array.isArray(services) && services.length > 0 ? services : mockHistory;

  const mappedHistory = Array.isArray(serviceHistory)
    ? serviceHistory.map(service => ({
        ...service,
        type: service.type,
        date: service.date,
      }))
    : [];

  console.log('ServiceHistoryModal - serviceHistory:', serviceHistory);
  console.log('ServiceHistoryModal - mappedHistory:', mappedHistory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Histórico de Serviços - {airConditioner.brand} {airConditioner.model}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Local: <span className="font-medium">{airConditioner.location}</span> | Série:{" "}
            <span className="font-mono font-medium">{airConditioner.serialNumber}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {mappedHistory.length > 0 ? (
            mappedHistory.map((service) => {
              const typeConfig = serviceTypeConfig[service.type]
              const sConfig = statusConfig[service.status || "iniciar"]
              return (
                <Card key={service.id} className="p-5 border-l-4 border-l-primary">
                  {/* Header do serviço */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={typeConfig?.color || ""}>{typeConfig?.label || service.type}</Badge>
                        <Badge className={sConfig?.color || ""}>{sConfig?.label || service.status}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(service.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{service.description}</p>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Técnico: {service.technician}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {onEdit && (
                        <Button variant="outline" size="sm" onClick={() => onEdit(service)} className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(service.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Provas/Documentos */}
                  {service.proof && service.proof.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        PROVAS E DOCUMENTOS
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.proof.map((doc, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="justify-start gap-2 text-xs h-9 bg-transparent"
                            asChild
                          >
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3 h-3" />
                              {doc.fileName}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum serviço registrado para este ar-condicionado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
