import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Luca</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link href="#benefits" className="text-foreground/80 hover:text-foreground transition-colors">
              Benefícios
            </Link>
            <Link href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Preços
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-success hover:bg-success/90 text-white">
              <Link href="/login">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
