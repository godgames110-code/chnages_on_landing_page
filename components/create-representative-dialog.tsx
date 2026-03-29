"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UploadImage } from "@/components/upload-image"

interface Representative {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  photoUrl?: string
}

interface CreateRepresentativeDialogProps {
  clientId: string
  representative?: Representative
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CreateRepresentativeDialog({
  clientId,
  representative,
  onSuccess,
  trigger,
}: CreateRepresentativeDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Representative>({
    name: representative?.name || "",
    email: representative?.email || "",
    phone: representative?.phone || "",
    role: representative?.role || "",
    photoUrl: representative?.photoUrl || undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = representative
        ? `/api/clients/${clientId}/representatives/${representative.id}`
        : `/api/clients/${clientId}/representatives`

      const method = representative ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          photo_url: formData.photoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar representante")
      }

      toast({
        title: "Sucesso!",
        description: representative
          ? "Representante atualizado com sucesso."
          : "Representante criado com sucesso.",
      })

      setOpen(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        photoUrl: undefined,
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar representante",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Representante
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {representative ? "Editar Representante" : "Adicionar Representante"}
          </DialogTitle>
          <DialogDescription>
            {representative
              ? "Atualize as informações do representante."
              : "Preencha os dados do novo representante da empresa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="João Silva"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="joao@empresa.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 98765-4321"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Gerente de Facilities"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <UploadImage
              endpoint={
                representative
                  ? `/api/representatives/${representative.id}/upload-photo`
                  : ""
              }
              fieldName="photo"
              currentImageUrl={formData.photoUrl}
              onSuccess={(url) => setFormData({ ...formData, photoUrl: url })}
              label="Foto do representante (opcional)"
              accept="image/png,image/jpeg,image/jpg"
              maxSizeMB={5}
              disabled={loading || !representative}
            />
            {!representative && (
              <p className="text-xs text-muted-foreground">
                A foto pode ser adicionada após criar o representante.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {representative ? "Salvar Alterações" : "Criar Representante"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
