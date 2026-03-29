"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { Budget, BudgetServiceItem } from "@/types/budget"

interface CreateBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => void
}

export default function CreateBudgetDialog({ open, onOpenChange, onSubmit }: CreateBudgetDialogProps) {
  const [formData, setFormData] = useState({
    documentTitle: "Orçamento de Serviços",
    serviceDescription: "",
    issueDate: new Date().toISOString().split("T")[0],
    validUntil: "",
    observations: "",
    status: "draft" as Budget["status"],
  })

  const [services, setServices] = useState<Omit<BudgetServiceItem, "id">[]>([
    { description: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
  ])



  const handleServiceChange = (index: number, field: keyof BudgetServiceItem, value: string | number) => {
    const newServices = [...services]
    newServices[index] = {
      ...newServices[index],
      [field]: value,
    }

    if (field === "quantity" || field === "unitPrice") {
      const quantity = field === "quantity" ? Number(value) : newServices[index].quantity
      const unitPrice = field === "unitPrice" ? Number(value) : newServices[index].unitPrice
      newServices[index].totalPrice = quantity * unitPrice
    }

    setServices(newServices)
  }

  const addService = () => {
    setServices([...services, { description: "", quantity: 1, unitPrice: 0, totalPrice: 0 }])
  }

  const removeService = (index: number) => {
    if (services.length > 1) {
      const newServices = services.filter((_, i) => i !== index)
      setServices(newServices)
    }
  }

  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + service.totalPrice, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.documentTitle || !formData.validUntil) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    const hasValidServices = services.some((s) => s.description && s.quantity > 0 && s.unitPrice > 0)
    if (!hasValidServices) {
      alert("Adicione pelo menos um serviço válido")
      return
    }

    const budgetServices: BudgetServiceItem[] = services
      .filter((s) => s.description && s.quantity > 0 && s.unitPrice > 0)
      .map((s, index) => ({
        ...s,
        id: `temp-${index}`,
      }))

    onSubmit({
      ...formData,
      services: budgetServices,
      totalValue: calculateTotal(),
    })

    // Reset form
    setFormData({
      documentTitle: "Orçamento de Serviços",
      serviceDescription: "",
      issueDate: new Date().toISOString().split("T")[0],
      validUntil: "",
      observations: "",
      status: "draft",
    })
    setServices([{ description: "", quantity: 1, unitPrice: 0, totalPrice: 0 }])
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
          <DialogDescription>Preencha os dados para criar um novo orçamento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Orçamento */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold text-foreground">Dados do Orçamento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="documentTitle">Título do Documento *</Label>
                <Input
                  id="documentTitle"
                  placeholder="Orçamento de Serviços"
                  value={formData.documentTitle}
                  onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="serviceDescription">Descrição Geral do Serviço</Label>
                <Textarea
                  id="serviceDescription"
                  placeholder="Descreva o tipo de serviço prestado"
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="issueDate">Data de Emissão *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="validUntil">Prazo de Validade *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Budget["status"] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="sent">Enviado</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lista de Serviços */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Lista de Serviços</h3>
              <Button type="button" variant="outline" size="sm" onClick={addService} className="gap-1">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Serviço {index + 1}</span>
                    {services.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label>Descrição do Serviço *</Label>
                    <Input
                      placeholder="Descreva o serviço"
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Quantidade *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => handleServiceChange(index, "quantity", parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Valor Unitário *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={service.unitPrice}
                        onChange={(e) => handleServiceChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        readOnly
                        value={formatCurrency(service.totalPrice)}
                        className="mt-1 bg-muted"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 px-4 bg-muted rounded-lg py-3">
              <span className="font-semibold text-foreground">Valor Total do Orçamento</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Observações e Condições</h3>
            <Textarea
              placeholder="Observações e condições do serviço"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Orçamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
