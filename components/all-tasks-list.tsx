"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit2, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const taskStatusConfig = {
  iniciar: {
    label: "Iniciar",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
  "em-andamento": {
    label: "Em Andamento",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  finalizada: {
    label: "Finalizada",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
}

const taskTypeConfig = {
  limpeza: "Limpeza",
  manutenção: "Manutenção",
  reparo: "Reparo",
  inspeção: "Inspeção",
}

interface AllTasksListProps {
  pmoc: any
  onEdit: (acId: string, taskId: string) => void
  onDelete: (acId: string, taskId: string) => void
}

export default function AllTasksList({ pmoc, onEdit, onDelete }: AllTasksListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const allTasks = useMemo(() => {
    const tasks: Array<{ ac: string; acId: string; acName: string; task: any }> = []
    pmoc.airConditioners.forEach((ac: any) => {
      ac.serviceHistory?.forEach((service: any) => {
        tasks.push({
          ac: ac.id,
          acId: ac.id,
          acName: `${ac.brand} - ${ac.location}`,
          task: service,
        })
      })
    })
    return tasks
  }, [pmoc.airConditioners])

  const filteredTasks = useMemo(() => {
    return allTasks.filter((item) => {
      const matchesSearch =
        item.acName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.task.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || item.task.status === statusFilter

      const matchesType = typeFilter === "all" || item.task.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [allTasks, searchTerm, statusFilter, typeFilter])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por AC, tipo ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="iniciar">Iniciar</SelectItem>
            <SelectItem value="em-andamento">Em Andamento</SelectItem>
            <SelectItem value="finalizada">Finalizada</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="limpeza">Limpeza</SelectItem>
            <SelectItem value="manutenção">Manutenção</SelectItem>
            <SelectItem value="reparo">Reparo</SelectItem>
            <SelectItem value="inspeção">Inspeção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((item) => {
            const statusConfig = taskStatusConfig[item.task.status as keyof typeof taskStatusConfig] || {
              label: item.task.status || "Desconhecido",
              className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
            }
            return (
              <Card key={`${item.acId}-${item.task.id}`} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{item.acName}</h3>
                      <Badge variant="outline" className="capitalize">
                        {taskTypeConfig[item.task.type as keyof typeof taskTypeConfig]}
                      </Badge>
                      <Badge className={`capitalize ${statusConfig.className}`}>{statusConfig.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.task.description}</p>
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Data</p>
                        <p className="text-foreground font-medium mt-1">
                          {new Date(item.task.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Técnico</p>
                        <p className="text-foreground font-medium mt-1">{item.task.technician}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Número de Provas</p>
                        <p className="text-foreground font-medium mt-1">{item.task.proofs?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => onEdit(item.acId, item.task.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => onDelete(item.acId, item.task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
