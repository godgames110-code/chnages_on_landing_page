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
import { useSubmit } from "@/components/form/useSubmit"
import ServerMessages from "@/components/form/ServerMessages"

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

  const { loading, serverMessage, serverErrors, submit } = useSubmit()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid) return

    await submit(
      "/api/signup",
      {
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirmPassword,
      },
      "POST",
      () => {
        router.push("/dashboard")
      }
    )
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Criar uma conta</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
              />
              <FieldDescription>Não compartilharemos seu email.</FieldDescription>
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

          <ServerMessages serverMessage={serverMessage} serverErrors={serverErrors} />
        </form>
      </CardContent>
    </Card>
  )
}
