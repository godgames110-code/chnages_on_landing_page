"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadImage } from "@/components/upload-image"

interface UserProfile {
  id: number
  name: string
  email: string
  isTechnician: boolean
  technician: {
    id: number
    technicalRegistration: string
    companyName: string
    companyDocument: string
    phone: string
    email: string
    companyLogoUrl: string | null
  } | null
}

interface ProfileFormProps {
  profile: UserProfile
  onUpdate: () => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPromoteDialog, setShowPromoteDialog] = useState(false)
  
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    password: "",
    confirmPassword: "",
  })

  const [technicianData, setTechnicianData] = useState({
    technicalRegistration: profile.technician?.technicalRegistration || "",
    companyName: profile.technician?.companyName || "",
    companyDocument: profile.technician?.companyDocument || "",
    phone: profile.technician?.phone || "",
    email: profile.technician?.email || "",
    companyLogoUrl: profile.technician?.companyLogoUrl || "",
  })

  const [promoteData, setPromoteData] = useState({
    technicalRegistration: "",
    companyName: "",
    companyDocument: "",
    phone: "",
    email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
      }

      if (formData.password) {
        payload.password = formData.password
      }

      if (profile.isTechnician) {
        payload.technician = technicianData
      }

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar perfil")
      }

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      })

      onUpdate()
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!promoteData.technicalRegistration || !promoteData.companyName || 
        !promoteData.companyDocument || !promoteData.phone) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promoteData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao promover para técnico")
      }

      toast({
        title: "Sucesso!",
        description: "Você foi promovido para técnico com sucesso!",
      })

      setShowPromoteDialog(false)
      onUpdate()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao promover para técnico",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <div id="general" className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Informações Pessoais</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha (opcional)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Deixe em branco para não alterar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirme a nova senha"
                disabled={!formData.password}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Informações do Técnico */}
      {profile.isTechnician && profile.technician && (
        <div id="technician" className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Informações Técnicas</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="technicalRegistration">Registro Técnico</Label>
                <Input
                  id="technicalRegistration"
                  value={technicianData.technicalRegistration}
                  onChange={(e) => setTechnicianData({ ...technicianData, technicalRegistration: e.target.value })}
                  placeholder="Ex: CREA-123456"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={technicianData.companyName}
                  onChange={(e) => setTechnicianData({ ...technicianData, companyName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyDocument">CNPJ</Label>
                <Input
                  id="companyDocument"
                  value={technicianData.companyDocument}
                  onChange={(e) => setTechnicianData({ ...technicianData, companyDocument: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="techPhone">Telefone</Label>
                <Input
                  id="techPhone"
                  type="tel"
                  value={technicianData.phone}
                  onChange={(e) => setTechnicianData({ ...technicianData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="techEmail">E-mail da Empresa</Label>
              <Input
                id="techEmail"
                type="email"
                value={technicianData.email}
                onChange={(e) => setTechnicianData({ ...technicianData, email: e.target.value })}
                placeholder="contato@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <UploadImage
                endpoint="/api/me/upload-logo"
                fieldName="logo"
                currentImageUrl={technicianData.companyLogoUrl}
                onSuccess={(url) => setTechnicianData({ ...technicianData, companyLogoUrl: url })}
                label="Logo da Empresa (opcional)"
                accept="image/png,image/jpeg,image/jpg"
                maxSizeMB={5}
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Informações Técnicas
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Botão para se tornar técnico */}
      {!profile.isTechnician && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Torne-se um Técnico
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastre suas informações profissionais e técnicas para acessar recursos exclusivos,
                criar orçamentos, gerenciar PMOCs e muito mais.
              </p>
              
              <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrar como Técnico
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Registrar como Técnico</DialogTitle>
                    <DialogDescription>
                      Preencha suas informações profissionais para se tornar um técnico verificado
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handlePromote} className="space-y-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="promoteRegistration">
                          Registro Técnico <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="promoteRegistration"
                          value={promoteData.technicalRegistration}
                          onChange={(e) => setPromoteData({ ...promoteData, technicalRegistration: e.target.value })}
                          placeholder="Ex: CREA-123456"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="promoteCompanyName">
                          Nome da Empresa <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="promoteCompanyName"
                          value={promoteData.companyName}
                          onChange={(e) => setPromoteData({ ...promoteData, companyName: e.target.value })}
                          placeholder="Sua Empresa LTDA"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="promoteDocument">
                          CNPJ <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="promoteDocument"
                          value={promoteData.companyDocument}
                          onChange={(e) => setPromoteData({ ...promoteData, companyDocument: e.target.value })}
                          placeholder="00.000.000/0000-00"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="promotePhone">
                          Telefone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="promotePhone"
                          type="tel"
                          value={promoteData.phone}
                          onChange={(e) => setPromoteData({ ...promoteData, phone: e.target.value })}
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promoteEmail">E-mail da Empresa</Label>
                      <Input
                        id="promoteEmail"
                        type="email"
                        value={promoteData.email}
                        onChange={(e) => setPromoteData({ ...promoteData, email: e.target.value })}
                        placeholder="contato@empresa.com"
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowPromoteDialog(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Registrar
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
