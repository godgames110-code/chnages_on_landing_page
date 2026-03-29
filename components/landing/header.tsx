"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, FileText, Settings, Wrench, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const services = [
  {
    title: "PMOC",
    href: "/pmoc-foz-do-iguacu",
    description: "Plano de Manutencao e Controle",
    icon: FileText
  },
  {
    title: "Instalacao",
    href: "/instalacao-ar-condicionado-foz-do-iguacu",
    description: "Instalacao profissional",
    icon: Settings
  },
  {
    title: "Manutencao",
    href: "/manutencao-ar-condicionado-foz-do-iguacu",
    description: "Preventiva e corretiva",
    icon: Wrench
  },
  {
    title: "Limpeza",
    href: "/limpeza-ar-condicionado-foz-do-iguacu",
    description: "Higienizacao completa",
    icon: Sparkles
  }
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Imperial Ar Condicionado"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors outline-none">
                Servicos
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {services.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <Link href={service.href} className="flex items-start gap-3 p-3 cursor-pointer">
                      <service.icon className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">{service.title}</div>
                        <div className="text-xs text-muted-foreground">{service.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Depoimentos
            </Link>
            <Link href="/#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contato
            </Link>
            <Button asChild>
              <Link href="/login">Area do Tecnico</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pt-4 pb-2 space-y-2">
            <Link
              href="/"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            
            {/* Mobile Services Accordion */}
            <div className="border-t border-b py-2">
              <button
                className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Servicos
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServicesOpen && (
                <div className="pl-4 space-y-1 mt-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="flex items-center gap-3 py-2 text-sm hover:text-primary transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsServicesOpen(false)
                      }}
                    >
                      <service.icon className="w-4 h-4 text-primary" />
                      <div>
                        <span className="font-medium">{service.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">{service.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#about"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/#testimonials"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Depoimentos
            </Link>
            <Link
              href="/#contact"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Button asChild className="w-full mt-4">
              <Link href="/login">Area do Tecnico</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
