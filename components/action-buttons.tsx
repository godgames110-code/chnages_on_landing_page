"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ActionButtonsProps {
  onNewIncome: () => void
  onNewExpense: () => void
}

export function ActionButtons({ onNewIncome, onNewExpense }: ActionButtonsProps) {
  const [downloading, setDownloading] = useState(false)

  async function handleExport() {
    setDownloading(true)
    try {
      const res = await fetch("/api/dashboard/transactions/downloadCsv", {
        method: "GET",
        credentials: "same-origin",
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        console.error("Failed to download CSV:", res.status, text)
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const disposition = res.headers.get("content-disposition")
      let filename = "transactions.csv"
      if (disposition) {
        const match = /filename\*?=([^;]+)/i.exec(disposition)
        if (match) {
          // remove possible UTF-8'' prefix and surrounding quotes
          filename = decodeURIComponent(match[1].replace(/^(UTF-8'')?/i, "").replace(/^"|"$/g, ""))
        }
      }
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading CSV:", error)
    } finally {
      setDownloading(false)
    }
  }
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default" size="lg" className="text-base bg-primary hover:bg-primary/90" onClick={onNewIncome}>
        Nova Receita
      </Button>
      <Button variant="outline" size="lg" className="text-base bg-transparent" onClick={onNewExpense}>
        Nova Despesa
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="text-base bg-transparent"
        onClick={handleExport}
        disabled={downloading}
      >
        {downloading ? "Baixando..." : "Exportar Relatório"}
      </Button>
    </div>
  )
}
