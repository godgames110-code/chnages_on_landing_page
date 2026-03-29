"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { UploadImage } from "@/components/upload-image"

interface FinishTaskModalProps {
  task: any
  acName: string
  onConfirm: (task: any, proofUrl?: string) => void
  onCancel: () => void
}

export default function FinishTaskModal({ task, acName, onConfirm, onCancel }: FinishTaskModalProps) {
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined)

  const handleConfirm = () => {
    const updatedTask = {
      ...task,
      status: "finalizada",
    }
    onConfirm(updatedTask, proofUrl)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Tarefa</DialogTitle>
          <DialogDescription>Adicione as provas de conclusão antes de finalizar</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações da tarefa */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">AR-CONDICIONADO</p>
              <p className="font-medium text-foreground">{acName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Tipo de Serviço</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {task.type}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Descrição</p>
              <p className="text-sm text-foreground">{task.description}</p>
            </div>
          </div>

          {/* Upload de provas */}
          <div className="space-y-3">
            <UploadImage
              endpoint={`/api/services/${task.id}/upload-proof`}
              fieldName="proof"
              currentImageUrl={proofUrl}
              onSuccess={(url) => setProofUrl(url)}
              label="Comprovante de Conclusão"
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              maxSizeMB={10}
            />
          </div>

          {/* Aviso */}
          <div className="p-3 bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Após finalizar, esta tarefa não poderá ser marcada como pendente novamente.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            Finalizar Tarefa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
