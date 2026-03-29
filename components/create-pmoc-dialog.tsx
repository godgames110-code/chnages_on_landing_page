"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { maskCPFOrCNPJ, maskPhone } from "@/lib/masks"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreatePMOCDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Client {
  id: number
  name: string
  phone: string
  email: string
  document?: string
}

export default function CreatePMOCDialog({ open, onOpenChange }: CreatePMOCDialogProps) {
  const [step, setStep] = useState(1)
  const [useExistingClient, setUseExistingClient] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientCnpj, setNewClientCnpj] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    buildingName: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    startDate: "",
    endDate: "",
  })

  const [selectedACs, setSelectedACs] = useState<{
    id: string
    brand: string
    model: string
    serial_number?: string
    location: string
    capacity?: string
  }[]>([])
  const [acInput, setAcInput] = useState({
    brand: "",
    model: "",
    serial_number: "",
    location: "",
    capacity: "",
  })

  // Fetch clients when dialog opens
  useEffect(() => {
    if (open && useExistingClient) {
      fetchClients()
    }
  }, [open, useExistingClient])

  // Debug: Monitor selectedACs changes
  useEffect(() => {
    console.log('selectedACs changed:', selectedACs.length, selectedACs)
  }, [selectedACs])

  const fetchClients = async () => {
    try {
      setLoadingClients(true)
      const response = await fetch('/api/clients')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes')
      }
      
      const data = await response.json()
      setClients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
      })
    } finally {
      setLoadingClients(false)
    }
  }

  const handleClientChange = (field: string, value: string) => {
    if (field === "clientType") {
      setUseExistingClient(value === "existing")
      setSelectedClientId("")
      setNewClientName("")
      setNewClientPhone("")
      setNewClientEmail("")
      setNewClientCnpj("")
    }
  }

  // Máscaras agora importadas de @/lib/masks

  const formatCEP = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    // Limita a 8 dígitos
    const limited = numbers.slice(0, 8)
    
    // Aplica a máscara: 00000-000
    if (limited.length <= 5) return limited
    return `${limited.slice(0, 5)}-${limited.slice(5)}`
  }

  const removeMask = (value: string) => {
    // Remove todos os caracteres que não são dígitos
    return value.replace(/\D/g, '')
  }

  const resolvePersonType = (document: string) => {
    const digits = removeMask(document)
    return digits.length > 11 ? 'PJ' : 'PF'
  }

  const newClientDocumentDigits = removeMask(newClientCnpj)
  const isNewClientCnpj = newClientDocumentDigits.length > 11

  const buscarCEP = async (cep: string) => {
    const cepLimpo = removeMask(cep)
    
    // Verifica se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
      return
    }

    try {
      setLoadingCep(true)
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        toast({
          variant: "destructive",
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto e tente novamente.",
        })
        return
      }

      // Preenche os campos automaticamente
      setFormData(prev => ({
        ...prev,
        address: data.logradouro || prev.address,
        location: data.bairro || prev.location,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }))

      toast({
        title: "CEP encontrado!",
        description: "Endereço preenchido automaticamente.",
      })
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível buscar o CEP. Tente novamente.",
      })
    } finally {
      setLoadingCep(false)
    }
  }

  const handleAddAC = () => {
    console.log('handleAddAC called')
    console.log('Current acInput:', acInput)
    console.log('Current selectedACs:', selectedACs)
    
    if (acInput.brand && acInput.model && acInput.location) {
      const newAC = { id: Date.now().toString(), ...acInput }
      console.log('Creating new AC:', newAC)
      
      // Use functional update to ensure we have the latest state
      setSelectedACs(prevACs => {
        const updatedACs = [...prevACs, newAC]
        console.log('Updated selectedACs:', updatedACs)
        return updatedACs
      })
      
      setAcInput({ brand: "", model: "", serial_number: "", location: "", capacity: "" })
      
      toast({
        title: "Ar-condicionado adicionado!",
        description: `${newAC.brand} ${newAC.model} em ${newAC.location}`,
      })
      
      console.log('AC added successfully!')
    } else {
      console.log('Missing required AC fields:', {
        brand: acInput.brand,
        model: acInput.model,
        location: acInput.location
      })
      
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha marca, modelo e localização do ar-condicionado.",
      })
    }
  }

  const handleRemoveAC = (id: string) => {
    setSelectedACs(selectedACs.filter((ac) => ac.id !== id))
  }

  const canProceedToStep2 = () => {
    if (useExistingClient) {
      return selectedClientId && formData.buildingName && formData.location && formData.address && 
             formData.city && formData.state && formData.zipCode && formData.startDate && formData.endDate
    } else {
      return newClientName && newClientPhone && formData.buildingName && formData.location && 
             formData.address && formData.city && formData.state && formData.zipCode && 
             formData.startDate && formData.endDate
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== SUBMITTING PMOC ===')
    console.log('Selected ACs:', selectedACs)
    console.log('Form Data:', formData)
    console.log('Client ID:', selectedClientId)
    
    // Warn if no ACs added
    if (selectedACs.length === 0) {
      const confirmWithoutACs = window.confirm(
        'Você não adicionou nenhum ar-condicionado a este PMOC.\n\n' +
        'Deseja continuar sem ar-condicionados? Você poderá adicioná-los depois.'
      )
      
      if (!confirmWithoutACs) {
        return
      }
    }
    
    try {
      setSubmitting(true)
      
      let clientId = selectedClientId
      
      // Create new client if needed
      if (!useExistingClient) {
        const documentDigits = removeMask(newClientCnpj)
        const personType = resolvePersonType(documentDigits)
        const clientResponse = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newClientName,
            phone: removeMask(newClientPhone),
            email: newClientEmail || null,
            person_type: personType,
            document: documentDigits || null,
          }),
        })
        
        if (!clientResponse.ok) {
          const errorData = await clientResponse.json().catch(() => ({}))
          throw new Error(errorData.error || 'Erro ao criar cliente')
        }
        
        const newClient = await clientResponse.json()
        clientId = newClient.id
      }
      
      // Create PMOC
      const pmocResponse = await fetch('/api/pmoc/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: parseInt(clientId),
          building_name: formData.buildingName,
          location: formData.location,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: removeMask(formData.zipCode),
          start_date: formData.startDate,
          end_date: formData.endDate,
          status: 'active',
        }),
      })
      
      if (!pmocResponse.ok) {
        throw new Error('Erro ao criar PMOC')
      }
      
      const newPmoc = await pmocResponse.json()
      
      // Add air conditioners if any
      if (selectedACs.length > 0) {
        console.log(`Adding ${selectedACs.length} air conditioners to PMOC ${newPmoc.id}`)
        try {
          // Send each AC to the backend
          for (const ac of selectedACs) {
            const acData = {
              brand: ac.brand,
              model: ac.model,
              serial_number: ac.serial_number || null,
              location: ac.location,
              capacity: ac.capacity || null,
              status: 'operational',
            }
            
            console.log('Sending AC data:', acData)
            
            const acResponse = await fetch(`/api/pmoc/${newPmoc.id}/air-conditioners`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(acData),
            })
            
            if (!acResponse.ok) {
              const errorData = await acResponse.json().catch(() => ({}))
              console.error('Erro ao adicionar ar-condicionado:', ac, 'Response:', errorData)
            } else {
              const responseData = await acResponse.json()
              console.log('AC added successfully:', responseData)
            }
          }
        } catch (error) {
          console.error('Erro ao adicionar ar-condicionados:', error)
          toast({
            variant: "destructive",
            title: "Aviso",
            description: "PMOC criado, mas houve erro ao adicionar alguns ar-condicionados.",
          })
        }
      } else {
        console.log('No air conditioners to add')
      }
      
      toast({
        title: "Sucesso",
        description: selectedACs.length > 0 
          ? `PMOC criado com ${selectedACs.length} ar-condicionado(s)!`
          : "PMOC criado com sucesso!",
      })
      
      // Close dialog and reload
      onOpenChange(false)
      
      // Reload page to show new PMOC
      window.location.reload()
    } catch (error) {
      console.error('Error creating PMOC:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível criar o PMOC.",
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  const resetForm = () => {
    setStep(1)
    setUseExistingClient(true)
    setSelectedClientId("")
    setNewClientName("")
    setNewClientPhone("")
    setNewClientEmail("")
    setNewClientCnpj("")
    setFormData({
      buildingName: "",
      location: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      startDate: "",
      endDate: "",
    })
    setSelectedACs([])
  }

  // Debug: log render
  console.log('CreatePMOCDialog render - selectedACs:', selectedACs.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Novo PMOC</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Passo 1: Informações do cliente e PMOC" : "Passo 2: Adicionar ar-condicionados"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {/* STEP 1 - Client and PMOC Info */}
            {step === 1 && (
              <div className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="font-semibold text-foreground">Cliente</h3>

                <Tabs defaultValue="existing" onValueChange={(value) => handleClientChange("clientType", value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
                    <TabsTrigger value="new">Novo Cliente</TabsTrigger>
                  </TabsList>

                  {/* Existing Client Tab */}
                  <TabsContent value="existing" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-select">Selecionar Cliente *</Label>
                      {loadingClients ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                          <SelectTrigger id="client-select">
                            <SelectValue placeholder="Escolha um cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name} - {client.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TabsContent>

                  {/* New Client Tab */}
                  <TabsContent value="new" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Nome do Cliente *</Label>
                      <Input
                        id="client-name"
                        placeholder="Nome da empresa ou condomínio"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-cnpj">CPF/CNPJ (Opcional)</Label>
                      <Input
                        id="client-cnpj"
                        placeholder="000.000.000-00"
                        value={newClientCnpj}
                        onChange={(e) => setNewClientCnpj(maskCPFOrCNPJ(e.target.value))}
                        inputMode="numeric"
                      />
                      {isNewClientCnpj && (
                        <p className="text-xs text-amber-600">
                          CNPJ detectado. O cliente sera criado como PJ.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-phone">Telefone *</Label>
                      <Input
                        id="client-phone"
                        placeholder="(11) 98765-4321"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(maskPhone(e.target.value))}
                        inputMode="numeric"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email (Opcional)</Label>
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="cliente@exemplo.com"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* PMOC Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Informações do PMOC</h3>

                <div className="space-y-2">
                  <Label htmlFor="building-name">Nome do Edifício *</Label>
                  <Input
                    id="building-name"
                    placeholder="Ex: Edifício Comercial Centro"
                    value={formData.buildingName}
                    onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip-code">CEP *</Label>
                  <div className="relative">
                    <Input
                      id="zip-code"
                      placeholder="00000-000"
                      value={formData.zipCode}
                      onChange={(e) => {
                        const newZipCode = formatCEP(e.target.value)
                        setFormData({ ...formData, zipCode: newZipCode })
                        // Busca automática quando completar 8 dígitos
                        if (removeMask(newZipCode).length === 8) {
                          buscarCEP(newZipCode)
                        }
                      }}
                      inputMode="numeric"
                      disabled={loadingCep}
                      className={loadingCep ? "pr-10" : ""}
                    />
                    {loadingCep && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  {formData.zipCode && removeMask(formData.zipCode).length === 8 && !loadingCep && (
                    <p className="text-xs text-muted-foreground">
                      ✓ Endereço preenchido automaticamente
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Bairro *</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Centro, Zona Sul"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data de Início *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-date">Data de Término *</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 - Add Air Conditioners */}
          {step === 2 && (
            <div className="space-y-6">
              {selectedACs.length === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    ⚠️ Atenção: Nenhum ar-condicionado adicionado
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Adicione pelo menos um ar-condicionado para facilitar o gerenciamento do PMOC.
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Adicionar Ar-Condicionados</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ac-brand">Marca *</Label>
                    <Input
                      id="ac-brand"
                      placeholder="Ex: Daikin, LG, Samsung"
                      value={acInput.brand}
                      onChange={(e) => setAcInput({ ...acInput, brand: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ac-model">Modelo *</Label>
                    <Input
                      id="ac-model"
                      placeholder="Ex: Inverter 12000"
                      value={acInput.model}
                      onChange={(e) => setAcInput({ ...acInput, model: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ac-serial">Número de Série (Opcional)</Label>
                  <Input
                    id="ac-serial"
                    placeholder="Ex: ABC123XYZ"
                    value={acInput.serial_number}
                    onChange={(e) => setAcInput({ ...acInput, serial_number: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ac-location">Localização *</Label>
                    <Input
                      id="ac-location"
                      placeholder="Ex: Sala 01, Corredor"
                      value={acInput.location}
                      onChange={(e) => setAcInput({ ...acInput, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ac-capacity">Capacidade (BTU) (Opcional)</Label>
                    <Input
                      id="ac-capacity"
                      placeholder="Ex: 12000"
                      value={acInput.capacity}
                      onChange={(e) => setAcInput({ ...acInput, capacity: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddAC} 
                  className="w-full gap-2 bg-transparent"
                  disabled={!acInput.brand || !acInput.model || !acInput.location}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Ar-Condicionado
                </Button>
                {(!acInput.brand || !acInput.model || !acInput.location) && (
                  <p className="text-xs text-muted-foreground text-center">
                    * Preencha marca, modelo e localização para adicionar
                  </p>
                )}
              </div>

              {/* List of Selected ACs */}
              {selectedACs.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">
                    Ar-Condicionados Selecionados ({selectedACs.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                    {selectedACs.map((ac) => (
                      <div
                        key={ac.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                      >
                        <div>
                          <p className="font-medium text-sm">{ac.brand} - {ac.model}</p>
                          <p className="text-xs text-muted-foreground">
                            {ac.location}
                            {ac.capacity && ` • ${ac.capacity} BTU`}
                            {ac.serial_number && ` • SN: ${ac.serial_number}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAC(ac.id)}
                          className="p-1 hover:bg-destructive hover:text-white rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum ar-condicionado adicionado ainda.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preencha os campos acima e clique em "Adicionar Ar-Condicionado"
                  </p>
                </div>
              )}
            </div>
          )}
          </div>

          {/* Fixed Footer - Navigation Buttons */}
          <div className="border-t bg-background px-6 py-4 shrink-0">
            {step === 1 && (
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setStep(2)} disabled={!canProceedToStep2()}>
                  Próximo: Adicionar ACs
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={submitting}>
                  Voltar
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    `Criar PMOC${selectedACs.length > 0 ? ` com ${selectedACs.length} AC(s)` : ' sem ACs'}`
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
