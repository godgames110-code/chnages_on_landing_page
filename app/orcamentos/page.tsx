"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import BudgetsList from "@/components/budgets-list"
import CreateBudgetDialog from "@/components/create-budget-dialog"
import EditBudgetDialog from "@/components/edit-budget-dialog"
import BudgetDetailsModal from "@/components/budget-details-modal"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import { generateBudgetPdf } from "@/lib/budget-pdf"
import type { Budget } from "@/types/budget"




export default function OrcamentosPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [isTechnician, setIsTechnician] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch user profile to check if user is technician
  useEffect(() => {
    fetchUserProfile()
  }, [])



  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setIsTechnician(data.isTechnician || false)
        setUserName(data.name || "")
        const logoUrl = data.technician?.companyLogoUrl
        setCompanyLogoUrl(logoUrl)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Fetch budgets from backend
  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/budget/list')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar orçamentos')
      }
      
      const data = await response.json()
      setBudgets(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching budgets:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os orçamentos.",
      })
      // Define lista vazia em caso de erro
      setBudgets([])
    } finally {
      setLoading(false)
    }
  }

    // Filter budgets based on search term and active tab
  const filteredBudgets = budgets.filter((budget) => {
    // Garantindo que strings potencialmente undefined não quebrem
    const companyName = budget.companyName ?? "";
    const cnpj = budget.cnpj ?? "";
    const documentTitle = budget.documentTitle ?? "";
    const technicalResponsible = budget.technicalResponsible ?? "";

    // Filtro por search term
    const matchesSearch =
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cnpj.toString().includes(searchTerm) || // se cnpj for array ou string
      documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technicalResponsible.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por aba ativa
    let matchesTab = true;
    if (activeTab === "draft") {
      matchesTab = budget.status === "draft";
    } else if (activeTab === "sent") {
      matchesTab = budget.status === "sent";
    } else if (activeTab === "approved") {
      matchesTab = budget.status === "approved";
    } else if (activeTab === "rejected") {
      matchesTab = budget.status === "rejected" || budget.status === "expired";
    }

    return matchesSearch && matchesTab;
  });


  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleCreateBudget = async (newBudget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBudget),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar orçamento')
      }

      const createdBudget = await response.json()
      setBudgets([createdBudget, ...budgets])
      setIsCreateDialogOpen(false)
      toast({
        title: "Sucesso",
        description: "Orçamento criado com sucesso.",
      })
    } catch (error) {
      console.error('Error creating budget:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o orçamento. Tente novamente.",
      })
    }
  }

  const handleEditBudget = async (updatedBudget: Budget) => {
    try {
      const response = await fetch(`/api/budget/${updatedBudget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBudget),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar orçamento')
      }

      const updated = await response.json()
      setBudgets(budgets.map((b) => (b.id === updated.id ? updated : b)))
      setIsEditDialogOpen(false)
      setEditingBudget(null)
      toast({
        title: "Sucesso",
        description: "Orçamento atualizado com sucesso.",
      })
    } catch (error) {
      console.error('Error updating budget:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o orçamento. Tente novamente.",
      })
    }
  }

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return

    try {
      const response = await fetch(`/api/budget/${budgetToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar orçamento')
      }

      setBudgets(budgets.filter((b) => b.id !== budgetToDelete.id))
      setShowDeleteConfirm(false)
      setBudgetToDelete(null)
      toast({
        title: "Sucesso",
        description: "Orçamento deletado com sucesso.",
      })
    } catch (error) {
      console.error('Error deleting budget:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deletar o orçamento. Tente novamente.",
      })
    }
  }

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setIsEditDialogOpen(true)
  }

  const handleOpenDelete = (budget: Budget) => {
    setBudgetToDelete(budget)
    setShowDeleteConfirm(true)
  }

    const handleExportPdf = (budget: Budget) => {
      generateBudgetPdf(budget, userName, false, companyLogoUrl ?? undefined)
      toast({
        title: "PDF Gerado",
        description: "O orçamento foi aberto para impressão/download.",
      })
    }

    const handleExportPdfWithoutValue = (budget: Budget) => {
      generateBudgetPdf(budget, userName, true, companyLogoUrl ?? undefined)
      toast({
        title: "PDF Gerado (sem valores)",
        description: "O orçamento foi aberto para impressão/download sem valores.",
      })
    }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
              <p className="text-sm text-muted-foreground mt-1">Gerencie seus orçamentos de serviços</p>
            </div>
            {isTechnician && (
              <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Novo Orçamento
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground text-lg">Carregando orçamentos...</p>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa, CNPJ, título ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <TabsList className="w-full sm:w-auto flex-wrap">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="draft" className="flex-1 sm:flex-none">
                  Rascunhos
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1 sm:flex-none">
                  Enviados
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex-1 sm:flex-none">
                  Aprovados
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex-1 sm:flex-none">
                  Rejeitados
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {sortedBudgets.length > 0 ? (
                <BudgetsList
                  budgets={sortedBudgets}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onViewDetails={setSelectedBudget}
                  onExportPdf={handleExportPdf}
                  onExportPdfWithoutValue={handleExportPdfWithoutValue}
                />
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Nenhum orçamento encontrado para a busca."
                      : activeTab === "all"
                        ? "Nenhum orçamento cadastrado ainda."
                        : `Nenhum orçamento com status "${activeTab}" encontrado.`}
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <CreateBudgetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateBudget}
      />

      <EditBudgetDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditBudget}
        budget={editingBudget}
      />

      <BudgetDetailsModal
        budget={selectedBudget}
        open={!!selectedBudget}
        onOpenChange={(open) => !open && setSelectedBudget(null)}
        onExportPdf={handleExportPdf}
        onExportPdfWithoutValue={handleExportPdfWithoutValue}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Deletar Orçamento"
        description={`Tem certeza que deseja deletar o orçamento para "${budgetToDelete?.companyName}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteBudget}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

