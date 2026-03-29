"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import type { AirConditioner, ServiceRecord } from "@/types/air-conditioner"

interface AddActivityModalProps {
  airConditioner: AirConditioner
  isOpen: boolean
  onClose: () => void
  onSave: (activity: ServiceRecord) => void
  editingActivity?: ServiceRecord
}

export default function AddActivityModal({
  airConditioner,
  isOpen,
  onClose,
  onSave,
  editingActivity,
}: AddActivityModalProps) {
  const [formData, setFormData] = useState({
    type: (editingActivity?.type || "manutenção") as "limpeza" | "manutenção" | "reparo" | "inspeção",
    date: editingActivity?.date || new Date().toISOString().split("T")[0],
    description: editingActivity?.description || "",
    technician: editingActivity?.technician || "",
    status: (editingActivity?.status || "iniciar") as "iniciar" | "em_andamento" | "finalizada",
  })
  const [proofs, setProofs] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const activity: ServiceRecord = {
      id: editingActivity?.id || `service-${Date.now()}`,
      type: formData.type,
      date: formData.date,
      description: formData.description,
      technician: formData.technician,
      status: formData.status,
      proof: proofs.map((file) => ({
        fileName: file.name,
        url: URL.createObjectURL(file),
        type: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "document",
      })),
    }

    onSave(activity)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      type: "manutenção",
      date: new Date().toISOString().split("T")[0],
      description: "",
      technician: "",
      status: "iniciar",
    })
    setProofs([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofs([...proofs, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setProofs(proofs.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingActivity ? "Editar Atividade" : "Adicionar Atividade"}</DialogTitle>
          <DialogDescription>
            {airConditioner.brand} - {airConditioner.location}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity-type">Tipo de Atividade</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as "limpeza" | "manutenção" | "reparo" | "inspeção",
                })
              }
            >
              <SelectTrigger id="activity-type">
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

          <div className="space-y-2">
            <Label htmlFor="activity-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "iniciar" | "em_andamento" | "finalizada",
                })
              }
            >
              <SelectTrigger id="activity-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iniciar">Iniciar</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-date">Data</Label>
            <Input
              id="activity-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-technician">Técnico Responsável</Label>
            <Input
              id="activity-technician"
              placeholder="Nome do técnico"
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-description">Descrição</Label>
            <Textarea
              id="activity-description"
              placeholder="Descreva a atividade realizada..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-proofs">Provas/Documentos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary cursor-pointer transition-colors">
              <input
                id="activity-proofs"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="activity-proofs" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Clique ou arraste arquivos aqui</span>
                </div>
              </label>
            </div>

            {proofs.length > 0 && (
              <div className="space-y-2">
                {proofs.map((file, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 bg-secondary p-2 rounded text-sm">
                    <span className="text-foreground truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{editingActivity ? "Atualizar" : "Salvar"} Atividade</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
