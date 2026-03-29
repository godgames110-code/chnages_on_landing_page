"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, MapPin, User, Calendar, DollarSign, Phone, Clock } from "lucide-react"

interface ServiceDetailsModalProps {
  service: any
  open: boolean
  onOpenChange: (open: boolean) => void
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

export default function ServiceDetailsModal({ service, open, onOpenChange }: ServiceDetailsModalProps) {
  if (!service) return null

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return {
      date: date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const { date, time } = formatDateTime(service.datetime)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">Detalhes do Serviço</DialogTitle>
              <DialogDescription className="mt-2">{service.description}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Badge className={categoryColors[service.category as keyof typeof categoryColors]}>
              {categoryLabels[service.category as keyof typeof categoryLabels]}
            </Badge>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Informações do Cliente</h4>
            <div className="space-y-3 pl-2 border-l-2 border-primary">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Nome</p>
                  <p className="font-medium text-foreground">{service.clientName}</p>
                </div>
              </div>

              {service.clientPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Telefone</p>
                    <p className="font-medium text-foreground">{service.clientPhone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Endereço</p>
                  <p className="text-sm text-foreground">{service.clientAddress}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Agendamento</h4>
            <div className="space-y-3 pl-2 border-l-2 border-accent">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Data</p>
                  <p className="font-medium text-foreground capitalize">{date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Horário</p>
                  <p className="font-medium text-foreground">{time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Valor do Serviço</p>
                  <p className="font-medium text-foreground text-lg">R$ {service.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
