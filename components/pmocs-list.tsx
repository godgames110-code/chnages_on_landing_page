"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Edit, Trash2, Calendar, MapPin, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface PMOC {
  id: number
  user_id: number
  client_id: number
  building_name: string
  location: string
  address: string
  city: string
  state: string
  zip_code: string
  start_date: string
  end_date: string
  last_maintenance: string | null
  next_maintenance: string | null
  technician_responsible: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

interface PMOCsListProps {
  searchTerm: string
}

export default function PMOCsList({ searchTerm }: PMOCsListProps) {
  const [pmocs, setPmocs] = useState<PMOC[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch PMOCs from API
  useEffect(() => {
    async function fetchPmocs() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/pmoc/list')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar PMOCs')
        }
        
        const data = await response.json()
        setPmocs(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching PMOCs:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar PMOCs')
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os PMOCs. Tente novamente.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPmocs()
  }, [toast])

  const filteredPmocs = pmocs.filter((pmoc) => {
    const matchesSearch =
      pmoc.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmoc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmoc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmoc.city.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este PMOC?')) {
      return
    }

    try {
      const response = await fetch(`/api/pmoc/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar PMOC')
      }

      setPmocs(pmocs.filter((pmoc) => pmoc.id !== id))
      toast({
        title: "Sucesso",
        description: "PMOC deletado com sucesso.",
      })
    } catch (err) {
      console.error('Error deleting PMOC:', err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deletar o PMOC. Tente novamente.",
      })
    }
  }

  const handleEdit = (id: number) => {
    console.log("Edit PMOC:", id)
    // TODO: Implement edit functionality
  }

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground text-lg">Carregando PMOCs...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <p className="text-destructive text-lg mb-2">Erro ao carregar PMOCs</p>
        <p className="text-muted-foreground">{error}</p>
      </Card>
    )
  }

  if (filteredPmocs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Nenhum PMOC encontrado. Tente ajustar a busca ou criar um novo.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1">
      {filteredPmocs.map((pmoc) => {
        return (
          <Card key={pmoc.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{pmoc.building_name}</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {pmoc.address}, {pmoc.city} - {pmoc.state}
                    </div>
                  </div>
                </div>

                {/* Cliente e Representante */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Local:</span>
                    <span className="font-medium text-foreground">{pmoc.location}</span>
                  </div>
                  {pmoc.technician_responsible && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <User className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">Responsável:</span>
                      <span className="font-medium text-foreground">{pmoc.technician_responsible}</span>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                    <p className="text-xs sm:text-sm font-medium text-foreground mt-1 capitalize">{pmoc.status}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Vigência
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-foreground mt-1">
                      {new Date(pmoc.start_date).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(pmoc.end_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {pmoc.last_maintenance && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Última Manutenção</p>
                      <p className="text-xs sm:text-sm font-medium text-foreground mt-1">
                        {new Date(pmoc.last_maintenance).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                  {pmoc.next_maintenance && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Próxima Manutenção</p>
                      <p className="text-xs sm:text-sm font-medium text-foreground mt-1">
                        {new Date(pmoc.next_maintenance).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-0 lg:flex-col">
                <Link href={`/pmoc/${pmoc.id}`} className="flex-1 lg:flex-none">
                  <Button variant="default" size="sm" className="gap-2 w-full text-xs sm:text-sm">
                    <Eye className="w-4 h-4" />
                    <span className="hidden xs:inline">Ver Detalhes</span>
                    <span className="inline xs:hidden">Detalhes</span>
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
