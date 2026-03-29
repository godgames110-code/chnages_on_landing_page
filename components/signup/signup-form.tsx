"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError = !email || emailRegex.test(email) ? null : "Por favor, insira um e-mail válido."
  const passwordError = !password || password.length >= 8 ? null : "A senha deve ter pelo menos 8 caracteres."
  const confirmError = !confirmPassword || password === confirmPassword ? null : "As senhas não coincidem."

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    !emailError &&
    !passwordError &&
    !confirmError

  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    setServerMessage(null)
    setServerErrors({})

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: confirmPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setServerMessage("Conta criada com sucesso! Você já está logado.")
        
        router.push("/dashboard")
      } else {
        setServerErrors(data.error?.errors || {})
        setServerMessage(data.error?.message || "Erro ao criar conta.")
      }
    } catch (error) {
      console.error(error)
      setServerMessage("Não foi possível conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie uma conta</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
              />
              <FieldDescription>Não compartilharemos seu e-mail.</FieldDescription>
              {emailError && <p className="text-red-600">{emailError}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
              />
              {passwordError && <p className="text-red-600">{passwordError}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!confirmError}
              />
              {confirmError && <p className="text-red-600">{confirmError}</p>}
            </Field>

            <Field>
              <Button type="submit" disabled={!isFormValid || loading}>
                {loading ? "Criando..." : "Criar Conta"}
              </Button>
            </Field>
          </FieldGroup>

          {serverMessage && <p className="text-green-700 mt-2">{serverMessage}</p>}
          {Object.keys(serverErrors).length > 0 && (
            <div className="text-red-700 mt-2">
              {Object.entries(serverErrors).map(([k, v]) => (
                <div key={k}>
                  <strong>{k}:</strong> {v.join(" ")}
                </div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
