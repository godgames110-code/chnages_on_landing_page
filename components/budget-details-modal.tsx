"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, Phone, Mail, User, Calendar, FileText, Download } from "lucide-react"
import type { Budget } from "@/types/budget"

interface BudgetDetailsModalProps {
  budget: Budget | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export default function BudgetDetailsModal({ budget, open, onOpenChange, onExportPdf, onExportPdfWithoutValue }: BudgetDetailsModalProps) {
  if (!budget) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const status = statusConfig[budget.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto overflow-x-hidden min-w-0">
        <DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
            <DialogTitle className="text-xl break-words pr-8 sm:pr-0 sm:truncate">{budget.documentTitle}</DialogTitle>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 min-w-0">
          {/* Dados da Empresa */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Dados da Empresa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg min-w-0">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Empresa</p>
                <p className="font-medium text-foreground break-words max-w-full">{budget.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">CNPJ</p>
                <p className="font-medium text-foreground break-all">{budget.cnpj}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Telefone</p>
                  <p className="font-medium text-foreground break-words">{budget.phone || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">E-mail</p>
                  <p className="font-medium text-foreground break-all">{budget.email || "Não informado"}</p>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Responsável Técnico</p>
                  <p className="font-medium text-foreground break-words max-w-full">{budget.technicalResponsible || "Não informado"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do Orçamento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Informações do Orçamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg min-w-0">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Data de Emissão</p>
                <p className="font-medium text-foreground">{formatDate(budget.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Prazo de Validade</p>
                <p className="font-medium text-foreground">{formatDate(budget.validUntil)}</p>
              </div>
              {budget.serviceDescription && (
                <div className="sm:col-span-2 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Descrição Geral</p>
                  <p className="font-medium text-foreground break-all max-w-full">{budget.serviceDescription}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Lista de Serviços */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Lista de Serviços
            </h3>
            <div className="border border-border rounded-lg overflow-hidden min-w-0">
              <div className="w-full overflow-x-auto min-w-0">
                <table className="min-w-[640px] w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Descrição
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Qtd
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Valor Unit.
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {budget.services.map((service, index) => (
                    <tr key={service.id || index} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground break-words">{service.description}</td>
                      <td className="px-4 py-3 text-center text-foreground">{service.quantity}</td>
                      <td className="px-4 py-3 text-right text-foreground">{formatCurrency(service.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {formatCurrency(service.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-semibold text-foreground">
                      Valor Total:
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-primary">
                      {formatCurrency(budget.totalValue)}
                    </td>
                  </tr>
                </tfoot>
                </table>
              </div>
            </div>
          </div>

          {budget.observations && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Observações e Condições</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap break-all max-w-full">{budget.observations}</p>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:flex-1">
              Fechar
            </Button>
            <Button onClick={() => onExportPdf(budget)} className="sm:flex-1 gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button onClick={() => onExportPdfWithoutValue(budget)} variant="secondary" className="sm:flex-1 gap-2">
              <Download className="w-4 h-4" />
              Sem Valores
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
