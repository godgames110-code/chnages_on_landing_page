"use client"

import { cn } from "@/lib/utils"
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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { loading, serverMessage, serverErrors, submit } = useSubmit()
  const router = useRouter()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError = !email || emailRegex.test(email) ? null : "Por favor, insira um e-mail válido."
  const isFormValid = email.trim().length > 0 && password.length >= 8 && !emailError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid) return

    await submit(
      "/api/login",
      { email: email.trim(), password },
      "POST",
      () => {
        // on success, navigate to dashboard
        router.push("/dashboard")
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
          <CardHeader>
          <CardTitle>Entrar na sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para entrar na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="text-red-600">{emailError}</p>}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Field>
                <Button type="submit" disabled={!isFormValid || loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <Button variant="outline" type="button">
                  Entrar com Google
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <a href="/signup">Cadastre-se</a>
                </FieldDescription>
              </Field>
            </FieldGroup>

            <ServerMessages serverMessage={serverMessage} serverErrors={serverErrors} />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
