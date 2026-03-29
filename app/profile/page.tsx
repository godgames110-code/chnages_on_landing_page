"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileForm } from "@/components/profile-form"
import { User, Building2, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/me")
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Erro ao carregar perfil")
      }

      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = () => {
    fetchProfile() // Recarregar dados após atualização
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
            <p className="text-destructive font-medium">{error || "Erro ao carregar perfil"}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e profissionais</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                
                {profile.isTechnician ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <ShieldCheck className="h-3 w-3" />
                    Técnico Verificado
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    <User className="h-3 w-3" />
                    Usuário Padrão
                  </div>
                )}
              </div>

              {profile.isTechnician && profile.technician && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-foreground">Informações Técnicas</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Empresa</p>
                      <p className="font-medium text-foreground">{profile.technician.companyName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Registro</p>
                      <p className="font-medium text-foreground">{profile.technician.technicalRegistration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CNPJ</p>
                      <p className="font-medium text-foreground">{profile.technician.companyDocument}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="bg-card rounded-lg border border-border overflow-hidden">
                <a
                  href="#general"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground bg-muted border-l-4 border-primary"
                >
                  <User className="h-4 w-4" />
                  Informações Gerais
                </a>
                {profile.isTechnician && (
                  <a
                    href="#technician"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Dados Técnicos
                  </a>
                )}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              <ProfileForm 
                profile={profile} 
                onUpdate={handleProfileUpdate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
