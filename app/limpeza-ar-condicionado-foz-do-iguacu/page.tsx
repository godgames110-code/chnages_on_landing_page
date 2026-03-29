import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Wind,
  Droplets,
  Bug,
  Heart,
  MessageCircle,
  ArrowRight,
  Shield,
  Clock,
  Calendar,
  Zap,
  Home,
  Building2,
  Baby,
  Stethoscope
} from "lucide-react"

export const metadata: Metadata = {
  title: "Limpeza de Ar Condicionado em Foz do Iguaçu | Imperial Ar Condicionado",
  description: "Limpeza profissional de ar condicionado em Foz do Iguaçu. Higienização completa, limpeza de filtros, serpentina e bandeja. Elimine fungos, bactérias e mau cheiro. Orçamento grátis!",
  keywords: [
    "limpeza ar condicionado Foz do Iguaçu",
    "higienização ar condicionado Foz",
    "limpeza de filtro ar condicionado",
    "limpeza split Foz do Iguaçu",
    "limpeza serpentina ar condicionado",
    "ar condicionado com mau cheiro Foz",
    "limpeza ar condicionado residencial",
    "limpeza ar condicionado comercial Foz do Iguaçu"
  ],
  openGraph: {
    title: "Limpeza de Ar Condicionado em Foz do Iguaçu | Imperial",
    description: "Limpeza profissional e higienização de ar condicionado em Foz do Iguaçu. Elimine fungos, bactérias e garanta ar puro.",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://imperialarfoz.com.br/limpeza-ar-condicionado-foz-do-iguacu",
  },
}

const cleaningIncludes = [
  "Limpeza completa dos filtros de ar",
  "Higienização da serpentina evaporadora",
  "Limpeza da bandeja de condensado",
  "Desobstrução do dreno",
  "Limpeza das aletas de ventilação",
  "Higienização da turbina",
  "Limpeza da unidade externa (condensadora)",
  "Aplicação de bactericida/fungicida",
  "Verificação do funcionamento geral",
  "Teste de temperatura após limpeza"
]

const benefits = [
  { 
    icon: Wind, 
    title: "Ar mais puro", 
    description: "Elimina até 99% das impurezas, fungos e bactérias do ar que você respira" 
  },
  { 
    icon: Zap, 
    title: "Economia de energia", 
    description: "Ar condicionado limpo consome até 30% menos energia elétrica" 
  },
  { 
    icon: Heart, 
    title: "Saúde respiratória", 
    description: "Previne alergias, rinite, asma e doenças respiratórias causadas por ar contaminado" 
  },
  { 
    icon: Clock, 
    title: "Maior durabilidade", 
    description: "Aumenta a vida útil do equipamento em até 50% com limpezas regulares" 
  },
  { 
    icon: Sparkles, 
    title: "Fim do mau cheiro", 
    description: "Elimina odores desagradáveis causados por fungos e sujeira acumulada" 
  },
  { 
    icon: Shield, 
    title: "Melhor desempenho", 
    description: "Resfriamento mais rápido e eficiente após a higienização completa" 
  }
]

const whoNeeds = [
  { icon: Home, title: "Residências", description: "Casas e apartamentos em Foz do Iguaçu" },
  { icon: Building2, title: "Escritórios", description: "Ambientes de trabalho e empresas" },
  { icon: Baby, title: "Famílias com crianças", description: "Proteção extra para os pequenos" },
  { icon: Stethoscope, title: "Pessoas alérgicas", description: "Fundamental para quem sofre de rinite ou asma" }
]

const warningSignals = [
  "Mau cheiro quando o ar condicionado é ligado",
  "Espirros e sintomas de alergia frequentes",
  "Poeira visível saindo pelas aletas",
  "Ar condicionado demora para gelar o ambiente",
  "Mais de 3 meses sem limpeza profissional",
  "Água pingando da unidade interna"
]

export default function LimpezaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Limpeza de Ar Condicionado em Foz do Iguaçu",
    description: "Limpeza profissional e higienização de ar condicionado em Foz do Iguaçu. Elimine fungos, bactérias e garanta ar puro para sua família ou empresa.",
    provider: {
      "@type": "LocalBusiness",
      name: "Imperial Ar Condicionado",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Foz do Iguaçu",
        addressRegion: "PR",
        addressCountry: "BR"
      },
      telephone: "+55-45-99838-2953"
    },
    areaServed: {
      "@type": "City",
      name: "Foz do Iguaçu"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Higienização Profissional
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance">
                  Limpeza de Ar Condicionado em <span className="text-primary">Foz do Iguaçu</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Imperial Ar Condicionado oferece limpeza profissional e higienização completa de ar condicionado 
                  em Foz do Iguaçu. Eliminamos fungos, bactérias e sujeira acumulada para garantir ar puro e saudável 
                  para sua família ou empresa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/5545998382953?text=Olá! Gostaria de agendar uma limpeza de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Agendar Limpeza
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent">
                    <a href="tel:+5545998382953">
                      <Phone className="mr-2 h-5 w-5" />
                      (45) 99838-2953
                    </a>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/tecnico-manutencao.png"
                    alt="Técnico realizando limpeza de ar condicionado em Foz do Iguaçu - Imperial"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Por que limpar */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Por que a limpeza de ar condicionado é essencial em Foz do Iguaçu?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Em <strong>Foz do Iguaçu</strong>, a combinação de calor intenso e umidade elevada cria o ambiente 
                  perfeito para a proliferação de <strong>fungos, bactérias e ácaros</strong> nos sistemas de ar condicionado. 
                  Sem uma limpeza regular, esses microorganismos se acumulam nos filtros e na serpentina, sendo dispersos 
                  pelo ambiente toda vez que o aparelho é ligado.
                </p>
                <p>
                  A <strong>limpeza profissional</strong> vai muito além de simplesmente lavar os filtros. Nossos técnicos 
                  realizam uma <strong>higienização completa</strong> de todos os componentes, utilizando produtos específicos 
                  para eliminar fungos e bactérias, garantindo que o ar que você respira seja realmente puro e saudável.
                </p>
                <p>
                  Além dos benefícios para a saúde, um ar condicionado limpo em Foz do Iguaçu funciona com mais eficiência, 
                  gela mais rápido e <strong>consome menos energia</strong>. Recomendamos limpeza a cada 3 meses para 
                  residências e mensal para ambientes comerciais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* O que está incluso */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              O que inclui a limpeza de ar condicionado da Imperial?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Serviço completo de higienização para máximo conforto e saúde
            </p>
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/50 border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {cleaningIncludes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Benefícios da limpeza de ar condicionado em Foz do Iguaçu
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Saúde, economia e conforto para você e sua família
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((item, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sinais de alerta */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Sinais de que seu ar precisa de limpeza
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Se você identificar qualquer um desses sinais, entre em contato com a Imperial Ar Condicionado 
                  em Foz do Iguaçu para agendar uma limpeza profissional:
                </p>
                <div className="space-y-4">
                  {warningSignals.map((signal, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <Bug className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="text-foreground">{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Card className="border-border/50 bg-destructive/5 border-destructive/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Riscos de não fazer limpeza regular
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Proliferação de fungos e bactérias nocivas à saúde
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Aumento de alergias, rinite e problemas respiratórios
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Maior consumo de energia e conta de luz mais alta
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Redução da vida útil do equipamento
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Mau cheiro constante no ambiente
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Risco de quebra e reparos mais caros
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quem precisa */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Quem precisa de limpeza de ar condicionado em Foz do Iguaçu?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Atendemos residências e empresas em toda a cidade
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {whoNeeds.map((item, index) => (
                <Card key={index} className="border-border/50 text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Frequência recomendada */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Com que frequência devo limpar o ar condicionado em Foz do Iguaçu?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Residências</h3>
                        <p className="text-sm text-muted-foreground">A cada 3 meses</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Para casas e apartamentos em Foz do Iguaçu com uso regular do ar condicionado. 
                      Em períodos de uso intenso (verão), pode ser necessário a cada 2 meses.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Comércios e Empresas</h3>
                        <p className="text-sm text-muted-foreground">Mensal</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Para lojas, escritórios, clínicas e hotéis em Foz do Iguaçu com uso contínuo. 
                      PMOC pode ser exigido para estabelecimentos comerciais.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Informações do serviço */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Agendamento</h3>
                  <p className="text-sm text-muted-foreground">Flexível e rápido</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Duração</h3>
                  <p className="text-sm text-muted-foreground">1 a 2 horas</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Garantia</h3>
                  <p className="text-sm text-muted-foreground">90 dias de garantia</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Resultado</h3>
                  <p className="text-sm text-muted-foreground">Imediato</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Precisa de limpeza de ar condicionado em Foz do Iguaçu?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Entre em contato com a Imperial Ar Condicionado e agende sua limpeza profissional. 
              Ar puro e saudável para sua casa ou empresa com garantia de qualidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5545998382953?text=Olá! Gostaria de agendar uma limpeza de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp: (45) 99838-2953
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Links internos */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Outros serviços de ar condicionado em Foz do Iguaçu
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link href="/pmoc-foz-do-iguacu" className="group">
                <Card className="border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <span className="font-medium text-foreground">PMOC em Foz do Iguaçu</span>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/instalacao-ar-condicionado-foz-do-iguacu" className="group">
                <Card className="border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <span className="font-medium text-foreground">Instalacao de Ar Condicionado</span>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/manutencao-ar-condicionado-foz-do-iguacu" className="group">
                <Card className="border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <span className="font-medium text-foreground">Manutencao de Ar Condicionado</span>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
