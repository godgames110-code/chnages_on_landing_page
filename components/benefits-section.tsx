import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const benefits = [
  "Reduza gastos desnecessários em até 30%",
  "Tome decisões baseadas em dados reais",
  "Poupe tempo com automação inteligente",
  "Alcance suas metas financeiras mais rápido",
  "Tenha controle total do seu dinheiro",
  "Acesse de qualquer lugar, a qualquer hora",
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl border border-border bg-card shadow-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="text-lg font-semibold">Resumo Mensal</h3>
                  <span className="text-sm text-muted-foreground">Novembro 2024</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Receita Total</span>
                    <span className="text-2xl font-bold text-success">R$ 28.450,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Despesas Totais</span>
                    <span className="text-2xl font-bold text-destructive">R$ 15.220,00</span>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Lucro Líquido</span>
                    <span className="text-3xl font-bold text-success">R$ 13.230,00</span>
                  </div>
                </div>

                <div className="bg-success/10 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-success">Meta atingida!</div>
                    <div className="text-sm text-muted-foreground">Você economizou 32% este mês</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Maximize seus lucros com inteligência financeira
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Luca foi desenvolvido para ajudar você a ter controle total sobre suas finanças e transformar dados em
              decisões lucrativas.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="bg-success hover:bg-success/90 text-white mt-4" asChild>
              <Link href="/">Experimentar Grátis</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
