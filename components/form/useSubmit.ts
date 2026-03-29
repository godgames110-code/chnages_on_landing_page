"use client"

import { useState } from "react"

type Errors = Record<string, string[]>

export function useSubmit() {
  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Errors>({})

  async function submit(
    url: string,
    body: Record<string, unknown> = {},
    method: string = "POST",
    onSuccess?: (data: any) => void
  ) {
    setLoading(true)
    setServerMessage(null)
    setServerErrors({})

    try {
      console.debug(`[useSubmit] ${method} ${url} — sending request (body keys: ${Object.keys(
        body
      ).join(",")})`);
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      }

      if (method.toUpperCase() !== "GET") {
        options.body = JSON.stringify(body)
      }

      const res = await fetch(url, options)
      console.debug(`[useSubmit] response ${res.status} for ${url}`);
      let data: any = null
      try {
        data = await res.json()
      } catch (e) {
        // ignore json parse errors
        data = null
      }

      if (res.ok) {
        setServerMessage(data?.message || "Success")
        onSuccess?.(data)
        return { ok: true, data }
      } else {
        console.debug(`[useSubmit] server returned error for ${url}`, data)
        // Backend retorna { error: "mensagem" } ou { error: { message: "...", errors: {...} } }
        const errorData = typeof data?.error === 'string' ? data?.error : data?.error?.message;
        const errorFields = typeof data?.error === 'object' ? data?.error?.errors || {} : {};
        setServerErrors(errorFields)
        setServerMessage(errorData || "Erro ao processar a requisição.")
        return { ok: false, data }
      }
    } catch (error) {
      setServerMessage("Não foi possível conectar ao servidor.")
      return { ok: false, data: null }
    } finally {
      setLoading(false)
    }
  }

  return { loading, serverMessage, serverErrors, submit, setServerMessage, setServerErrors }
}
