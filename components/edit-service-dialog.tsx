"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EditServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (service: any) => void
  service: any
  categories: Array<{ value: string; label: string }>
}

export default function EditServiceDialog({
  open,
  onOpenChange,
  onSubmit,
  service,
  categories,
}: EditServiceDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    datetime: "",
    category: "",
    status: "active",
    clientName: "",
    clientAddress: "",
  })

  useEffect(() => {
    if (service) {
      setFormData({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        datetime: service.datetime,
        category: service.category,
        status: service.status,
        clientName: service.clientName,
        clientAddress: service.clientAddress,
      })
    }
  }, [service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.price || !formData.datetime || !formData.clientName) {
      alert("Preencha todos os campos obrigatórios")
      return
    }
    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>Atualize as informações do serviço</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input
              id="name"
              placeholder="Ex: Limpeza de Filtros"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição do Serviço</Label>
            <Textarea
              id="description"
              placeholder="Descreva o serviço em detalhes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="datetime">Data e Hora</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              placeholder="Ex: João Silva ou Empresa XYZ"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="clientAddress">Endereço do Cliente</Label>
            <Input
              id="clientAddress"
              placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
