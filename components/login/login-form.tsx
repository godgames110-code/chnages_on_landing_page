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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  const router = useRouter()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError = !email || emailRegex.test(email) ? null : "Por favor, insira um e-mail válido."
  const isFormValid = email.trim().length > 0 && password.length >= 8 && !emailError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid) return

    setLoading(true)
    setServerMessage(null)
    setServerErrors({})

    try {
      console.debug(`[login-form] POST /api/login — attempting login for ${email}`)
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      console.debug(`[login-form] /api/login returned status=${res.status}`, data)

      if (res.ok) {
        setServerMessage("Login realizado com sucesso!")
        router.push("/dashboard")
      } else {
        setServerErrors(data.error?.errors || {})
        setServerMessage(data.error?.message || "Erro ao fazer login.")
      }
    } catch (error) {
      console.error(error)
      setServerMessage("Não foi possível conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                    Forgot your password?
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
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
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
    </div>
  )
}
