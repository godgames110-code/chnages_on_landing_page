"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Receipt, FileText, Users, Calendar, User, LogOut, Wrench } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/transactions", label: "Transações", icon: Receipt },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/appointments", label: "Agendamentos", icon: Calendar },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/pmoc", label: "PMOC", icon: Wrench },
  { href: "/profile", label: "Perfil", icon: User },
]

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-success">
                <span className="text-lg font-bold text-white">IA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-tight">Imperial</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Ar Condicionado</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation (icons only) */}
            <nav className="hidden md:flex lg:hidden items-center gap-1">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Logout - Desktop */}
              <Link
                href="/logout"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Sair</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Menu Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-success">
              <span className="text-sm font-bold text-white">IA</span>
            </div>
            <span className="font-semibold">Menu</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu Navigation */}
        <nav className="flex flex-col p-3 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          
          {/* Divider */}
          <div className="h-px bg-border my-2" />
          
          {/* Logout */}
          <Link
            href="/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Link>
        </nav>
      </aside>
    </>
  )
}
