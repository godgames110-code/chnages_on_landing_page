"use client"

import type { Transaction } from "@/types/transaction"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface TransactionsListProps {
  transactions: Transaction[]
  onSelectTransaction: (transaction: Transaction) => void
  selectedTransactionId?: number
}

export function TransactionsList({ transactions, onSelectTransaction, selectedTransactionId }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <p className="text-muted-foreground text-lg">Nenhuma transação encontrada</p>
        <p className="text-muted-foreground text-sm mt-2">Tente ajustar seus filtros</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">
          {transactions.length} {transactions.length === 1 ? "Transação" : "Transações"}
        </h2>
      </div>

      <div className="divide-y divide-border overflow-x-hidden">
        {transactions
          .slice()
          .sort((a, b) => new Date((b as any).dateIso || b.date).getTime() - new Date((a as any).dateIso || a.date).getTime())
          .map((transaction) => {
          const isIncome = transaction.type === "income"
          const isSelected = selectedTransactionId === transaction.id

          return (
            <button
              key={transaction.id}
              onClick={() => onSelectTransaction(transaction)}
              className={`w-full p-4 hover:bg-muted/50 transition-colors text-left ${
                isSelected ? "bg-primary/5 border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isIncome ? "bg-primary/10" : "bg-destructive/10"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{transaction.name}</p>
                    <div className="mt-1 text-sm text-muted-foreground min-w-0 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <p className="max-w-full truncate">{transaction.date}</p>
                      <span className="hidden sm:inline text-muted-foreground shrink-0">•</span>
                      <span className="inline-flex max-w-full break-all px-2 py-0.5 bg-muted rounded-full">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  className={`text-lg font-semibold text-right self-end sm:self-auto sm:shrink-0 sm:ml-4 ${
                    isIncome ? "text-primary" : "text-destructive"
                  }`}
                >
                  {isIncome ? "+" : ""}{`R$${Math.abs(transaction.amount).toFixed(2)}`}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
