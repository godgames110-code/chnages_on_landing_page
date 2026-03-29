import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-4 py-2 text-sm text-success-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Transforme sua gestão financeira</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight text-balance">
              Controle total do seu <span className="text-success">lucro</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              Luca é a plataforma completa para gerenciar receitas, despesas e fluxo de caixa. Tome decisões
              inteligentes com dados em tempo real e visualizações poderosas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-success hover:bg-success/90 text-white text-lg h-14 px-8" asChild>
                <Link href="/">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent" asChild>
                <Link href="#features">Ver Recursos</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Usuários ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">R$ 50M+</div>
                <div className="text-sm text-muted-foreground">Gerenciados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">4.9★</div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-success/20 to-success/5 p-8">
                <div className="bg-background rounded-xl shadow-lg p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Saldo Atual</div>
                      <div className="text-4xl font-bold text-foreground mt-1">R$ 45.230,00</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-success/5 rounded-lg p-4">
                      <div className="text-xs text-muted-foreground">Receitas</div>
                      <div className="text-2xl font-bold text-success mt-1">+R$ 12.000</div>
                      <div className="text-xs text-success mt-1">↑ 23% este mês</div>
                    </div>
                    <div className="bg-destructive/5 rounded-lg p-4">
                      <div className="text-xs text-muted-foreground">Despesas</div>
                      <div className="text-2xl font-bold text-destructive mt-1">-R$ 7.000</div>
                      <div className="text-xs text-destructive mt-1">↓ 12% este mês</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Salário", amount: "+R$ 5.000", positive: true },
                      { name: "Aluguel", amount: "-R$ 1.500", positive: false },
                      { name: "Freelance", amount: "+R$ 2.300", positive: true },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${transaction.positive ? "bg-success/10" : "bg-destructive/10"} flex items-center justify-center`}
                          >
                            {transaction.positive ? "+" : "-"}
                          </div>
                          <span className="text-sm font-medium">{transaction.name}</span>
                        </div>
                        <span
                          className={`text-sm font-bold ${transaction.positive ? "text-success" : "text-destructive"}`}
                        >
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-success/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-success/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
