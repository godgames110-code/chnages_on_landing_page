export interface BudgetServiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Budget {
  id: string
  documentTitle: string
  serviceDescription: string
  issueDate: string
  validUntil: string
  services: BudgetServiceItem[]
  totalValue: number
  observations: string
  status: "draft" | "sent" | "approved" | "rejected" | "expired"
  createdAt: string
  updatedAt: string
  // Campos vindos do técnico (somente leitura)
  companyName?: string
  cnpj?: string
  phone?: string
  email?: string
  technicalResponsible?: string
}
