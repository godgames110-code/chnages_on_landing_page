"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, Calendar, Edit2, Trash2, MoreVertical, FileText, DollarSign, Eye, Download } from "lucide-react"
import type { Budget } from "@/types/budget"

interface BudgetsListProps {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
  onViewDetails: (budget: Budget) => void
  onExportPdf: (budget: Budget) => void
  onExportPdfWithoutValue: (budget: Budget) => void
}

const statusConfig = {
  draft: { label: "Rascunho", className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
  sent: { label: "Enviado", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  approved: { label: "Aprovado", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  rejected: { label: "Rejeitado", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  expired: { label: "Expirado", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
}

export default function BudgetsList({ budgets, onEdit, onDelete, onViewDetails, onExportPdf, onExportPdfWithoutValue }: BudgetsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const isExpiringSoon = (validUntil: string) => {
    const today = new Date()
    const expirationDate = new Date(validUntil)
    const diffTime = expirationDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 7
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => {
        const status = statusConfig[budget.status]
        const expiringSoon = isExpiringSoon(budget.validUntil)

        return (
          <Card
            key={budget.id}
            className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
              expiringSoon && budget.status !== "expired" ? "border-orange-400 border-2" : ""
            }`}
            onClick={() => onViewDetails(budget)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Badge className={status.className}>{status.label}</Badge>
                <h3 className="font-semibold text-foreground text-base line-clamp-1 mt-2">{budget.documentTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">{budget.companyName}</p>
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
                      onViewDetails(budget)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onExportPdf(budget)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onExportPdfWithoutValue(budget)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Exportar PDF (sem valores)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(budget)
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(budget)
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
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground line-clamp-1">CNPJ: {budget.cnpj}</p>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {budget.services.length} {budget.services.length === 1 ? "serviço" : "serviços"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-xs text-muted-foreground">Emissão: {formatDate(budget.issueDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Validade: {formatDate(budget.validUntil)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{formatCurrency(budget.totalValue)}</span>
                  </div>
                </div>
              </div>

              {expiringSoon && budget.status !== "expired" && (
                <Badge className="w-full justify-center bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                  Expira em breve
                </Badge>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
