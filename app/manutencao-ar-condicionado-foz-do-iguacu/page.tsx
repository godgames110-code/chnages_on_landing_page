import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { 
  Phone, 
  Wrench, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  Thermometer,
  Wind,
  Droplets,
  Volume2,
  MessageCircle,
  ArrowRight,
  Shield,
  Clock,
  Calendar,
  Zap
} from "lucide-react"

export const metadata: Metadata = {
  title: "Manutenção de Ar Condicionado em Foz do Iguaçu | Imperial Ar Condicionado",
  description: "Manutenção preventiva e corretiva de ar condicionado em Foz do Iguaçu. Limpeza de filtros, higienização, reparo e conserto. Técnicos especializados com garantia. Orçamento grátis!",
  keywords: [
    "manutenção ar condicionado Foz do Iguaçu",
    "limpeza ar condicionado Foz",
    "conserto ar condicionado Foz do Iguaçu",
    "manutenção preventiva ar condicionado",
    "higienização ar condicionado",
    "reparo ar condicionado Foz",
    "técnico ar condicionado Foz do Iguaçu"
  ],
  openGraph: {
    title: "Manutenção de Ar Condicionado em Foz do Iguaçu | Imperial",
    description: "Manutenção preventiva e corretiva de ar condicionado em Foz do Iguaçu. Limpeza, higienização e reparo com garantia.",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://imperialarfoz.com.br/manutencao-ar-condicionado-foz-do-iguacu",
  },
}

const preventiveServices = [
  "Limpeza dos filtros de ar",
  "Higienização da serpentina",
  "Verificação do gás refrigerante",
  "Limpeza da bandeja de condensado",
  "Verificação elétrica completa",
  "Limpeza da unidade externa",
  "Teste de funcionamento",
  "Lubrificação de componentes"
]

const correctiveServices = [
  "Recarga de gás refrigerante",
  "Reparo de vazamentos",
  "Troca de compressor",
  "Substituição de capacitores",
  "Reparo de placas eletrônicas",
  "Troca de motor do ventilador",
  "Desobstrução de dreno",
  "Substituição de peças"
]

const warningSignals = [
  { icon: Thermometer, title: "Não gela adequadamente", description: "Ar condicionado funcionando mas não resfria como deveria" },
  { icon: Wind, title: "Fluxo de ar fraco", description: "Ventilação reduzida mesmo na velocidade máxima" },
  { icon: Droplets, title: "Vazamento de água", description: "Água pingando da unidade interna ou externa" },
  { icon: Volume2, title: "Ruídos estranhos", description: "Barulhos incomuns durante o funcionamento" },
  { icon: AlertTriangle, title: "Mau cheiro", description: "Odor desagradável quando o ar é ligado" },
  { icon: Zap, title: "Alto consumo de energia", description: "Conta de luz aumentou significativamente" }
]

export default function ManutencaoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Manutenção de Ar Condicionado em Foz do Iguaçu",
    description: "Manutenção preventiva e corretiva de ar condicionado em Foz do Iguaçu. Limpeza, higienização e reparo.",
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
                  <Wrench className="w-4 h-4" />
                  Manutenção Especializada
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance">
                  Manutenção de Ar Condicionado em <span className="text-primary">Foz do Iguaçu</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Imperial Ar Condicionado oferece manutenção preventiva e corretiva de ar condicionado em Foz do Iguaçu. 
                  Nossa equipe especializada cuida do seu equipamento para garantir máximo desempenho, economia de energia 
                  e ar puro para sua família ou empresa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/5545998382953?text=Olá! Gostaria de solicitar um orçamento para manutenção de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Solicitar Manutenção
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
                    alt="Técnico realizando manutenção de ar condicionado em Foz do Iguaçu - Imperial"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Importância da manutenção */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Por que a manutenção de ar condicionado é importante em Foz do Iguaçu?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Em <strong>Foz do Iguaçu</strong>, onde o clima é quente durante boa parte do ano, o ar condicionado 
                  trabalha intensamente. Essa alta demanda torna a <strong>manutenção regular</strong> ainda mais 
                  importante para garantir o bom funcionamento do equipamento e evitar problemas.
                </p>
                <p>
                  Um ar condicionado sem manutenção adequada pode consumir até <strong>30% mais energia</strong>, 
                  prejudicar a qualidade do ar com acúmulo de fungos e bactérias, e ter sua vida útil reduzida 
                  significativamente. Além disso, pequenos problemas não tratados podem evoluir para defeitos 
                  graves e reparos caros.
                </p>
                <p>
                  A <strong>Imperial Ar Condicionado</strong> recomenda manutenção preventiva a cada 3 a 6 meses 
                  para residências em Foz do Iguaçu, e manutenção mensal para ambientes comerciais com uso intenso. 
                  Nossos técnicos especializados garantem um serviço completo e de qualidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sinais de alerta */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Sinais de que seu ar condicionado precisa de manutenção
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Fique atento a estes sinais e entre em contato com a Imperial Ar Condicionado em Foz do Iguaçu
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {warningSignals.map((item, index) => (
                <Card key={index} className="border-border/50 border-amber-200 bg-amber-50/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tipos de manutenção */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
              Serviços de Manutenção de Ar Condicionado em Foz do Iguaçu
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Preventiva */}
              <Card className="border-border/50 border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Manutenção Preventiva</h3>
                      <p className="text-muted-foreground">Evite problemas antes que aconteçam</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    A manutenção preventiva é realizada periodicamente para manter seu ar condicionado 
                    funcionando perfeitamente. Inclui limpeza, verificação e ajustes para prevenir defeitos.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {preventiveServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Corretiva */}
              <Card className="border-border/50 border-accent/20 bg-accent/5">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Wrench className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Manutenção Corretiva</h3>
                      <p className="text-muted-foreground">Reparos e consertos especializados</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Quando seu ar condicionado apresenta defeitos, nossa equipe realiza diagnóstico 
                    preciso e reparo com peças originais e garantia de serviço.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {correctiveServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent-foreground shrink-0" />
                        <span className="text-sm text-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Limpeza e Higienização */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Serviço Especializado
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Limpeza e Higienização de Ar Condicionado em Foz do Iguaçu
                </h2>
                <div className="prose prose-lg text-muted-foreground space-y-4">
                  <p>
                    A <strong>limpeza profissional</strong> do ar condicionado vai muito além da simples troca de filtros. 
                    Em Foz do Iguaçu, com a umidade característica da região, é comum o acúmulo de fungos e bactérias 
                    nos componentes internos do aparelho.
                  </p>
                  <p>
                    Nossa <strong>higienização completa</strong> elimina microorganismos, remove sujeira acumulada 
                    na serpentina e bandeja, e garante que o ar que você respira seja puro e saudável. 
                    Ideal para pessoas alérgicas e ambientes com crianças.
                  </p>
                </div>
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/5545998382953?text=Olá! Gostaria de agendar uma limpeza de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Agendar Limpeza
                    </a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Frequência</h3>
                    <p className="text-sm text-muted-foreground">A cada 3-6 meses</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Duração</h3>
                    <p className="text-sm text-muted-foreground">1 a 2 horas</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Garantia</h3>
                    <p className="text-sm text-muted-foreground">90 dias</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Economia</h3>
                    <p className="text-sm text-muted-foreground">Até 30% energia</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Benefícios da manutenção regular de ar condicionado em Foz do Iguaçu
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 mt-12">
                {[
                  { title: "Economia de energia", description: "Ar condicionado limpo e bem regulado consome menos energia, reduzindo sua conta de luz" },
                  { title: "Maior durabilidade", description: "Manutenção regular pode dobrar a vida útil do seu equipamento" },
                  { title: "Ar mais puro", description: "Higienização elimina fungos, bactérias e ácaros do sistema" },
                  { title: "Melhor desempenho", description: "Equipamento funcionando na capacidade máxima, com resfriamento eficiente" },
                  { title: "Evita reparos caros", description: "Problemas identificados cedo custam menos para resolver" },
                  { title: "Conforto garantido", description: "Ar condicionado sempre pronto para os dias mais quentes de Foz do Iguaçu" }
                ].map((item, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-6">
                      <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Precisa de manutenção de ar condicionado em Foz do Iguaçu?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Entre em contato com a Imperial Ar Condicionado e agende sua manutenção. 
              Atendemos residências e empresas em toda Foz do Iguaçu com agilidade e qualidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5545998382953?text=Olá! Gostaria de agendar uma manutenção de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
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
                    <span className="font-medium text-foreground">Instalação de Ar Condicionado</span>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/#contato" className="group">
                <Card className="border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <span className="font-medium text-foreground">Fale Conosco</span>
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
