"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskFormModalProps {
  task?: any
  onSave: (task: any) => void
  onClose: () => void
}

export default function TaskFormModal({ task, onSave, onClose }: TaskFormModalProps) {
  const [formData, setFormData] = useState({
    id: task?.id || `service-${Date.now()}`,
    date: task?.date || new Date().toISOString().split("T")[0],
    type: task?.type || "limpeza",
    description: task?.description || "",
    technician: task?.technician || "",
    status: task?.status || "iniciar",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          <DialogDescription>
            {task ? "Atualize as informações da tarefa" : "Adicione uma nova tarefa"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Serviço</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
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

            <div className="grid gap-2">
              <Label htmlFor="technician">Técnico Responsável</Label>
              <Input
                id="technician"
                value={formData.technician}
                onChange={(e) => handleChange("technician", e.target.value)}
                placeholder="Nome do técnico"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descrição da tarefa"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciar">Iniciar</SelectItem>
                  <SelectItem value="em-andamento">Em Andamento</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Tarefa</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
