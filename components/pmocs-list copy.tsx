"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Edit, Trash2, Calendar, MapPin, User } from "lucide-react"
import Link from "next/link"

interface PMOC {
  id: string
  building: string
  location: string
  representative: string
  lastMaintenance: string
  nextMaintenance: string
  acUnits: number
  createdAt: string
  clientName: string
  startDate: string
  endDate: string
}

const mockPMOCs: PMOC[] = [
  {
    id: "1",
    building: "Edifício Comercial Centro",
    location: "Rua das Flores, 123 - São Paulo, SP",
    representative: "João Silva",
    clientName: "Empresa ABC Ltda",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    lastMaintenance: "2025-11-15",
    nextMaintenance: "2025-12-15",
    acUnits: 8,
    createdAt: "2025-10-01",
  },
  {
    id: "2",
    building: "Prédio Administrativo",
    location: "Avenida Brasil, 456 - São Paulo, SP",
    representative: "Maria Santos",
    clientName: "Tech Solutions Inc",
    startDate: "2025-02-01",
    endDate: "2026-01-31",
    lastMaintenance: "2025-10-10",
    nextMaintenance: "2025-12-10",
    acUnits: 12,
    createdAt: "2025-09-15",
  },
  {
    id: "3",
    building: "Shopping Center Vista",
    location: "Avenida Paulista, 789 - São Paulo, SP",
    representative: "Pedro Costa",
    clientName: "Vista Mall Group",
    startDate: "2024-12-01",
    endDate: "2025-11-30",
    lastMaintenance: "2025-11-20",
    nextMaintenance: "2025-12-20",
    acUnits: 24,
    createdAt: "2025-08-20",
  },
  {
    id: "4",
    building: "Hospital Central",
    location: "Rua da Saúde, 321 - São Paulo, SP",
    representative: "Ana Oliveira",
    clientName: "Hospital Central S.A.",
    startDate: "2025-01-15",
    endDate: "2026-01-14",
    lastMaintenance: "2025-11-25",
    nextMaintenance: "2025-12-25",
    acUnits: 16,
    createdAt: "2025-07-10",
  },
  {
    id: "5",
    building: "Condomínio Residencial Sunset",
    location: "Rua Tranquila, 654 - São Paulo, SP",
    representative: "João Silva",
    clientName: "Condomínio Sunset",
    startDate: "2025-03-01",
    endDate: "2026-02-28",
    lastMaintenance: "2025-11-01",
    nextMaintenance: "2025-12-01",
    acUnits: 20,
    createdAt: "2025-09-05",
  },
]

interface PMOCsListProps {
  searchTerm: string
}

export default function PMOCsList({ searchTerm }: PMOCsListProps) {
  const [pmocs, setPmocs] = useState<PMOC[]>(mockPMOCs)

  const filteredPmocs = pmocs.filter((pmoc) => {
    const matchesSearch =
      pmoc.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmoc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmoc.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmoc.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleDelete = (id: string) => {
    setPmocs(pmocs.filter((pmoc) => pmoc.id !== id))
  }

  const handleEdit = (id: string) => {
    console.log("Edit PMOC:", id)
  }

  if (filteredPmocs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Nenhum PMOC encontrado. Tente ajustar a busca ou criar um novo.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {filteredPmocs.map((pmoc) => {
        return (
          <Card key={pmoc.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{pmoc.building}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {pmoc.location}
                    </div>
                  </div>
                </div>

                {/* Cliente e Representante */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-medium text-foreground">{pmoc.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Representante:</span>
                    <span className="font-medium text-foreground">{pmoc.representative}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Unidades AC</p>
                    <p className="text-sm font-medium text-foreground mt-1">{pmoc.acUnits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Vigência
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {new Date(pmoc.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(pmoc.endDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Última Manutenção</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {new Date(pmoc.lastMaintenance).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Próxima Manutenção</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {new Date(pmoc.nextMaintenance).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 lg:flex-col">
                <Link href={`/pmoc/${pmoc.id}`} className="flex-1 lg:flex-none">
                  <Button variant="default" size="sm" className="gap-2 w-full">
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(pmoc.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(pmoc.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
