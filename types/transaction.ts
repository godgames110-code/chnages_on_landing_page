export interface Transaction {
  id: number
  name: string
  date: string
  amount: number
  type: "income" | "expense"
  category: string
  description?: string
}

// Use: import type { Transaction } from '@/types/transaction'