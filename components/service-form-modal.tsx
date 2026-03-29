"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import type { ServiceRecord } from "./air-conditioner-list"

interface ServiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (service: ServiceRecord) => void
  initialData?: ServiceRecord
}

export default function ServiceFormModal({ isOpen, onClose, onSave, initialData }: ServiceFormModalProps) {
  const [formData, setFormData] = useState<Partial<ServiceRecord>>({
    type: "manutenção",
    status: "finalizada",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        type: "manutenção",
        status: "finalizada",
      })
    }
  }, [initialData])

  const handleSave = () => {
    if (formData.date && formData.type && formData.description && formData.technician) {
      const service: ServiceRecord = {
        id: initialData?.id || `serv-${Date.now()}`,
        date: formData.date,
        type: formData.type as ServiceRecord["type"],
        description: formData.description,
        technician: formData.technician,
        proof: formData.proof,
        status: formData.status as ServiceRecord["status"],
      }
      onSave(service)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium text-foreground">Data</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Tipo</label>
            <Select
              value={formData.type || "manutenção"}
              onValueChange={(value) => setFormData({ ...formData, type: value as ServiceRecord["type"] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="manutenção">Manutenção</SelectItem>
                <SelectItem value="reparo">Reparo</SelectItem>
                <SelectItem value="inspeção">Inspeção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select
              value={formData.status || "finalizada"}
              onValueChange={(value) => setFormData({ ...formData, status: value as ServiceRecord["status"] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iniciar">Iniciar</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o serviço realizado"
              className="mt-1 min-h-24"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Técnico Responsável</label>
            <Input
              value={formData.technician || ""}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              placeholder="Nome do técnico"
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
