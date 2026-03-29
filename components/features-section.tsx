import { BarChart3, Shield, Zap, TrendingUp, PieChart, Bell } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Análise em Tempo Real",
    description:
      "Visualize seus dados financeiros com gráficos interativos e relatórios detalhados atualizados em tempo real.",
  },
  {
    icon: TrendingUp,
    title: "Fluxo de Caixa Inteligente",
    description: "Acompanhe entradas e saídas com projeções automáticas e alertas de tendências financeiras.",
  },
  {
    icon: PieChart,
    title: "Categorização Automática",
    description: "Organize suas transações automaticamente com categorias inteligentes e personalizáveis.",
  },
  {
    icon: Bell,
    title: "Notificações Inteligentes",
    description: "Receba alertas importantes sobre despesas, metas atingidas e oportunidades de economia.",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Seus dados protegidos com criptografia de ponta a ponta e autenticação em dois fatores.",
  },
  {
    icon: Zap,
    title: "Sincronização Instantânea",
    description: "Acesse seus dados de qualquer dispositivo com sincronização automática e em tempo real.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Tudo que você precisa para crescer
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Recursos poderosos para transformar sua gestão financeira em uma máquina de lucro
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:border-success/50"
            >
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                <feature.icon className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
