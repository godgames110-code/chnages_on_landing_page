"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wrench, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6 py-4">
        {/* Logo e Título */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">PMOC Manager</span>
            <span className="text-xs text-muted-foreground">Ar Condicionado</span>
          </div>
        </Link>

        {/* Navegação */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive("/") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            PMOCs
          </Link>
          <Link
            href="/servicos"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive("/servicos") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Wrench className="h-4 w-4" />
            Serviços
          </Link>
        </nav>

        {/* Perfil do Usuário */}
        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end text-sm sm:flex">
            <p className="font-medium text-foreground">Técnico Silva</p>
            <p className="text-xs text-muted-foreground">ID: 12345</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
            TS
          </div>
        </div>
      </div>
    </header>
  )
}
