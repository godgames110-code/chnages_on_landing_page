"use client"

import { Search } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

interface TransactionsFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  typeFilter: "all" | "income" | "expense"
  onTypeFilterChange: (value: "all" | "income" | "expense") => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: string[]
}

export function TransactionsFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: TransactionsFiltersProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Type filter */}
        <div>
          <Select value={typeFilter} onValueChange={(v) => onTypeFilterChange(v as "all" | "income" | "expense") }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os Tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category filter */}
        <div>
          <Select value={categoryFilter} onValueChange={(v) => onCategoryFilterChange(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.filter(cat => cat && cat.trim()).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters summary */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-sm text-muted-foreground">Filtros ativos:</span>
        {typeFilter !== "all" && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{typeFilter === 'income' ? 'Receitas' : 'Despesas'}</span>
        )}
        {categoryFilter !== "all" && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {categoryFilter}
          </span>
        )}
        {searchTerm && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {'"'}
            {searchTerm}
            {'"'}
          </span>
        )}
        {typeFilter === "all" && categoryFilter === "all" && !searchTerm && (
          <span className="text-sm text-muted-foreground">Nenhum</span>
        )}
      </div>
    </div>
  )
}
