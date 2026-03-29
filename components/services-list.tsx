"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DollarSign, Calendar, Edit2, Trash2, MoreVertical, MapPin, Clock } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  datetime: string
  category: string
  status: string
  createdAt: string
  clientName: string
  clientAddress: string
  taskDescription: string
  weather: string
}

interface ServicesListProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onViewDetails: (service: Service) => void
}

const categoryColors = {
  limpeza: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  manutencao: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  reparo: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  inspecao: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  instalacao: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const categoryLabels = {
  limpeza: "Limpeza",
  manutencao: "Manutenção",
  reparo: "Reparo",
  inspecao: "Inspeção",
  instalacao: "Instalação",
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export default function ServicesList({ services, onEdit, onDelete, onViewDetails }: ServicesListProps) {
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const isToday = (datetime: string) => {
    const serviceDate = new Date(datetime).toDateString()
    const today = new Date().toDateString()
    return serviceDate === today
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const { date, time } = formatDateTime(service.datetime)
        const todayService = isToday(service.datetime)

        return (
          <Card
            key={service.id}
            className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
              todayService ? "border-accent border-2" : ""
            }`}
            onClick={() => onViewDetails(service)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Badge className={`${categoryColors[service.category as keyof typeof categoryColors]} mb-2`}>
                  {categoryLabels[service.category as keyof typeof categoryLabels]}
                </Badge>
                <h3 className="font-semibold text-foreground text-base line-clamp-1">{service.clientName}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(service)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(service)
                    }}
                    className="gap-2 cursor-pointer text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground line-clamp-2">{service.clientAddress}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Valor</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">R$ {service.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {todayService && (
                <Badge className="w-full justify-center bg-accent text-accent-foreground">Serviço Hoje</Badge>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
