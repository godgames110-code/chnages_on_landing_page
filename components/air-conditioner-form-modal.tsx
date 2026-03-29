"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AirConditioner {
  id: string
  brand: string
  model: string
  serialNumber: string
  location: string
  capacity: string
  installationDate: string
  lastService: string
  status: "operational" | "maintenance-pending" | "out-of-service"
}

interface AirConditionerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<AirConditioner, "id" | "serviceHistory">) => void
  initialData?: AirConditioner
}

export default function AirConditionerFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AirConditionerFormModalProps) {
  const [formData, setFormData] = useState<{
    brand: string
    model: string
    serialNumber: string
    location: string
    capacity: string
    installationDate: string
    lastService: string
    status: "operational" | "maintenance-pending" | "out-of-service"
  }>({
    brand: "",
    model: "",
    serialNumber: "",
    location: "",
    capacity: "",
    installationDate: "",
    lastService: "",
    status: "operational",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || "",
        model: initialData.model || "",
        serialNumber: initialData.serialNumber || "",
        location: initialData.location || "",
        capacity: initialData.capacity || "",
        installationDate: initialData.installationDate || "",
        lastService: initialData.lastService || "",
        status: initialData.status || "operational",
      })
    } else {
      setFormData({
        brand: "",
        model: "",
        serialNumber: "",
        location: "",
        capacity: "",
        installationDate: "",
        lastService: "",
        status: "operational",
      })
    }
  }, [initialData, isOpen])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Ar-Condicionado" : "Novo Ar-Condicionado"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                placeholder="Ex: Daikin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="Ex: Inverter 12000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Número de Série (Opcional)</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange("serialNumber", e.target.value)}
              placeholder="Ex: ABC123XYZ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Ex: Sala de Servidores"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidade (BTU) (Opcional)</Label>
            <Input
              id="capacity"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              placeholder="Ex: 24000 BTU"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installationDate">Data de Instalação (Opcional)</Label>
              <Input
                id="installationDate"
                type="date"
                value={formData.installationDate}
                onChange={(e) => handleChange("installationDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastService">Último Serviço (Opcional)</Label>
              <Input
                id="lastService"
                type="date"
                value={formData.lastService}
                onChange={(e) => handleChange("lastService", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operacional</SelectItem>
                <SelectItem value="maintenance-pending">Manutenção Pendente</SelectItem>
                <SelectItem value="out-of-service">Fora de Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{initialData ? "Atualizar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
