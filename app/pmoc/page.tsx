"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import PMOCsList from "@/components/pmocs-list"
import CreatePMOCDialog from "@/components/create-pmoc-dialog"
import { DashboardHeader } from "@/components/dashboard-header"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />


      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Seus PMOCs</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Gerencie todos os Planos de Manutenção, Operação e Controle
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="gap-2 w-full sm:w-auto text-base sm:text-lg">
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Criar Novo PMOC</span>
              <span className="inline xs:hidden">Novo PMOC</span>
            </Button>
          </div>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, endereço ou representante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="sm:-mx-0 -mx-2">
          <PMOCsList searchTerm={searchTerm} />
        </div>
      </main>

      <CreatePMOCDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
