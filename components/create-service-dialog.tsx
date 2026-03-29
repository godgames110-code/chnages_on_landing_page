"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { maskCPFOrCNPJ, maskPhone } from "@/lib/masks"

interface CreateServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (service: any) => void
  categories: Array<{ value: string; label: string }>
}

const existingClients = [
  { id: "1", name: "Empresa ABC Ltda", phone: "(11) 98765-4321" },
  { id: "2", name: "Condomínio Residencial XYZ", phone: "(11) 99876-5432" },
  { id: "3", name: "Shopping Center Premium", phone: "(11) 97654-3210" },
]

export default function CreateServiceDialog({ open, onOpenChange, onSubmit, categories }: CreateServiceDialogProps) {
  const [useExistingClient, setUseExistingClient] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientDocument, setNewClientDocument] = useState("")

  const documentDigits = newClientDocument.replace(/\D/g, "")
  const isNewClientCnpj = documentDigits.length > 11

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    datetime: "",
    category: "",
    status: "active",
    clientAddress: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const clientValid = useExistingClient ? selectedClientId : newClientName && newClientPhone
    if (!formData.name || !formData.category || !formData.price || !formData.datetime || !clientValid) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    const clientData = useExistingClient
      ? existingClients.find((c) => c.id === selectedClientId)
      : {
          name: newClientName,
          phone: newClientPhone,
          document: documentDigits || undefined,
          person_type: isNewClientCnpj ? "PJ" : "PF",
        }

    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
      client: clientData,
    })

    setUseExistingClient(true)
    setSelectedClientId("")
    setNewClientName("")
    setNewClientPhone("")
    setNewClientDocument("")
    setFormData({
      name: "",
      description: "",
      price: "",
      datetime: "",
      category: "",
      status: "active",
      clientAddress: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
          <DialogDescription>Adicione um novo serviço ao seu catálogo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[500px] overflow-y-auto">
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold text-foreground">Cliente</h3>

            <Tabs defaultValue="existing" onValueChange={(value) => setUseExistingClient(value === "existing")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
                <TabsTrigger value="new">Novo Cliente</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-2 mt-4">
                <Label htmlFor="client-select">Selecionar Cliente *</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger id="client-select">
                    <SelectValue placeholder="Escolha um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="new" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="new-client-name">Nome do Cliente *</Label>
                  <Input
                    id="new-client-name"
                    placeholder="Nome da empresa ou pessoa"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-client-phone">Telefone *</Label>
                  <Input
                    id="new-client-phone"
                    placeholder="(11) 98765-4321"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(maskPhone(e.target.value))}
                    inputMode="numeric"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-client-document">CPF/CNPJ (Opcional)</Label>
                  <Input
                    id="new-client-document"
                    placeholder="000.000.000-00"
                    value={newClientDocument}
                    onChange={(e) => setNewClientDocument(maskCPFOrCNPJ(e.target.value))}
                    inputMode="numeric"
                  />
                  {isNewClientCnpj && (
                    <p className="text-xs text-amber-600">
                      CNPJ detectado. O cliente sera criado como PJ.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

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
            <Label htmlFor="clientAddress">Endereço do Cliente</Label>
            <Input
              id="clientAddress"
              placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Serviço
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
