import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-success to-success/80 p-12 md:p-16">
          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Junte-se a milhares de usuários que já estão no controle do seu dinheiro. Comece grátis hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8" asChild>
                <Link href="/">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8 border-white/20 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="#features">Saber Mais</Link>
              </Button>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}
