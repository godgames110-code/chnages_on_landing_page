"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Users,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  User,
  Building2,
  FileText
} from "lucide-react"
import { maskCPFOrCNPJ, maskPhone } from "@/lib/masks"

interface Client {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  document?: string | null
  person_type?: 'PF' | 'PJ' | null
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    document: "",
    person_type: "PF" as "PF" | "PJ",
  })

  // Fetch clients
  useEffect(() => {
    fetchClients()
  }, [])

  // Filter clients
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredClients(
        clients.filter(
          (c) =>
            c.name?.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term) ||
            c.phone?.includes(term) ||
            c.document?.includes(term)
        )
      )
    }
  }, [searchTerm, clients])

  async function fetchClients() {
    try {
      setLoading(true)
      const res = await fetch("/api/clients")
      const data = await res.json().catch(() => [])
      if (res.ok && Array.isArray(data)) {
        setClients(data.map((c: any) => ({
          id: String(c.id),
          name: c.name || '',
          email: c.email || null,
          phone: c.phone || null,
          address: c.address || null,
          document: c.document || null,
          person_type: c.person_type || null,
        })))
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal(client?: Client) {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone ? maskPhone(client.phone) : "",
        address: client.address || "",
        document: client.document ? maskCPFOrCNPJ(client.document) : "",
        person_type: client.person_type || "PF",
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        document: "",
        person_type: "PF",
      })
    }
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setEditingClient(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      document: "",
      person_type: "PF",
    })
  }

  function removeMask(value: string) {
    return value.replace(/\D/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Informe o nome do cliente")
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        name: formData.name,
        email: formData.email || null,
        phone: removeMask(formData.phone) || null,
        address: formData.address || null,
        document: removeMask(formData.document) || null,
        person_type: formData.person_type,
      }

      if (editingClient) {
        const res = await fetch(`/api/clients/${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          await fetchClients()
          handleCloseModal()
        } else {
          alert(data?.error || "Erro ao atualizar cliente")
        }
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          await fetchClients()
          handleCloseModal()
        } else {
          alert(data?.error || "Erro ao criar cliente")
        }
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      alert("Erro ao salvar cliente")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) {
      return
    }

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchClients()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data?.error || "Erro ao excluir cliente")
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      alert("Erro ao excluir cliente")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">Carregando clientes</p>
              <p className="text-sm text-muted-foreground mt-1">Buscando dados...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {clients.length} {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, telefone ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm
                    ? "Tente buscar por outros termos"
                    : "Adicione seu primeiro cliente para começar"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => handleOpenModal()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Cliente
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {client.person_type === 'PJ' ? (
                          <Building2 className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {client.person_type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenModal(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {client.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{maskPhone(client.phone)}</span>
                      </div>
                    )}
                    {client.document && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{maskCPFOrCNPJ(client.document)}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Criação/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="person_type">Tipo de Pessoa</Label>
              <Select
                value={formData.person_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, person_type: value as "PF" | "PJ" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {formData.person_type === "PJ" ? "Razão Social" : "Nome"} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.person_type === "PJ" ? "Nome da empresa" : "Nome completo"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">
                {formData.person_type === "PJ" ? "CNPJ" : "CPF"}
              </Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) =>
                  setFormData({ ...formData, document: maskCPFOrCNPJ(e.target.value) })
                }
                placeholder={formData.person_type === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : editingClient ? (
                  "Salvar Alterações"
                ) : (
                  "Criar Cliente"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
