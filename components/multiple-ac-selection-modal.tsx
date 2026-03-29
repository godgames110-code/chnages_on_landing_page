"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

interface AirConditioner {
  id: string
  brand: string
  model: string
  serialNumber: string
  location: string
  capacity: string
  status: "operational" | "maintenance-pending" | "out-of-service"
}

interface MultipleACSelectionModalProps {
  isOpen: boolean
  airConditioners: AirConditioner[]
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
}

const statusConfig = {
  operational: {
    label: "Operacional",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  "maintenance-pending": {
    label: "Manutenção Pendente",
    icon: AlertCircle,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  "out-of-service": {
    label: "Fora de Serviço",
    icon: AlertCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
}

export default function MultipleACSelectionModal({
  isOpen,
  airConditioners,
  onClose,
  onConfirm,
}: MultipleACSelectionModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelectAll = () => {
    if (selectedIds.length === airConditioners.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(airConditioners.map((ac) => ac.id))
    }
  }

  const handleToggleAC = (acId: string) => {
    setSelectedIds((prev) => (prev.includes(acId) ? prev.filter((id) => id !== acId) : [...prev, acId]))
  }

  const handleConfirm = () => {
    if (selectedIds.length > 0) {
      onConfirm(selectedIds)
      setSelectedIds([])
    }
  }

  const handleClose = () => {
    setSelectedIds([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar Ar-Condicionados</DialogTitle>
          <DialogDescription>
            Escolha os ar-condicionados para adicionar o serviço. {selectedIds.length} selecionado
            {selectedIds.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Select All Button */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Checkbox
              checked={selectedIds.length === airConditioners.length && airConditioners.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label className="text-sm font-medium cursor-pointer flex-1">
              Selecionar Todos ({airConditioners.length})
            </label>
          </div>

          {/* AC Cards */}
          {airConditioners.map((ac) => {
            const isSelected = selectedIds.includes(ac.id)
            const config = statusConfig[ac.status as keyof typeof statusConfig]
            const StatusIcon = config.icon

            return (
              <Card
                key={ac.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700" : ""
                }`}
                onClick={() => handleToggleAC(ac.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={isSelected} onCheckedChange={() => handleToggleAC(ac.id)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{ac.brand}</h4>
                        <p className="text-xs text-muted-foreground">{ac.model}</p>
                      </div>
                      <Badge variant="outline" className={config.className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide">Localização</p>
                        <p className="font-medium text-foreground">{ac.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground uppercase tracking-wide">Identificador</p>
                        <p className="font-mono text-foreground">{ac.serialNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground uppercase tracking-wide">Capacidade</p>
                        <p className="font-medium text-foreground">{ac.capacity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={selectedIds.length === 0}>
            Confirmar Seleção ({selectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
