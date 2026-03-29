"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API_URL } from "@/lib/utils"

interface UploadImageProps {
  endpoint: string
  fieldName?: string
  currentImageUrl?: string | null
  onSuccess?: (url: string) => void
  label?: string
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
}

export function UploadImage({
  endpoint,
  fieldName = "file",
  currentImageUrl,
  onSuccess,
  label = "Imagem",
  accept = "image/png,image/jpeg,image/jpg",
  maxSizeMB = 10,
  disabled = false,
}: UploadImageProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const { toast } = useToast()

  const validateFile = (file: File): string | null => {
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      return `Arquivo muito grande (máximo ${maxSizeMB}MB)`
    }

    const allowedTypes = accept.split(',').map(t => t.trim())
    const fileType = file.type
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        return fileType.startsWith(type.split('*')[0])
      }
      return fileType === type || file.name.endsWith(type.replace('image/', '.'))
    })

    if (!isAllowed) {
      return "Tipo de arquivo não permitido"
    }

    return null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar arquivo
    const validationError = validateFile(file)
    if (validationError) {
      toast({
        title: "Erro na validação",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append(fieldName, file)
      formData.append("endpoint", endpoint)
      formData.append("fieldName", fieldName)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erro no upload")
      }

      const data = await response.json()
      
      // Extrair URL da resposta (pode estar em diferentes campos)
      const uploadedUrl = data.company_logo_url || 
                         data.photo_url || 
                         data.proof_photo_url || 
                         data.url ||
                         data.companyLogoUrl

      if (uploadedUrl) {
        setPreview(uploadedUrl)
        onSuccess?.(uploadedUrl)
      }

      toast({
        title: "Sucesso!",
        description: "Imagem enviada com sucesso",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Falha ao enviar imagem",
        variant: "destructive",
      })
      // Reverter preview em caso de erro
      setPreview(currentImageUrl || null)
    } finally {
      setUploading(false)
      // Limpar input
      e.target.value = ""
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onSuccess?.("")
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`upload-${fieldName}`}>{label}</Label>
      
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
            disabled={uploading || disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          id={`upload-${fieldName}`}
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={uploading || disabled}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(`upload-${fieldName}`)?.click()}
          disabled={uploading || disabled}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {preview ? "Trocar Imagem" : "Escolher Imagem"}
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Formatos aceitos: {accept.replace(/image\//g, '').replace(/,/g, ', ')}. Máximo {maxSizeMB}MB.
      </p>
    </div>
  )
}
