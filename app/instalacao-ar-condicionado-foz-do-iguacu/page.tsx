import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { 
  Phone, 
  Settings, 
  CheckCircle2, 
  Zap,
  ThermometerSnowflake,
  Home,
  Building2,
  Factory,
  MessageCircle,
  ArrowRight,
  Shield,
  Clock,
  Award
} from "lucide-react"

export const metadata: Metadata = {
  title: "Instalação de Ar Condicionado em Foz do Iguaçu | Imperial Ar Condicionado",
  description: "Instalação profissional de ar condicionado split, multi-split e central em Foz do Iguaçu. Técnicos certificados, garantia de serviço e orçamento gratuito. Atendimento residencial e comercial.",
  keywords: [
    "instalação ar condicionado Foz do Iguaçu",
    "instalar ar condicionado Foz",
    "ar condicionado split Foz do Iguaçu",
    "instalação split",
    "técnico ar condicionado Foz",
    "ar condicionado residencial",
    "ar condicionado comercial Foz do Iguaçu"
  ],
  openGraph: {
    title: "Instalação de Ar Condicionado em Foz do Iguaçu | Imperial",
    description: "Instalação profissional de ar condicionado em Foz do Iguaçu. Técnicos certificados e garantia de serviço.",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://imperialarfoz.com.br/instalacao-ar-condicionado-foz-do-iguacu",
  },
}

const benefits = [
  "Técnicos certificados e experientes",
  "Instalação conforme normas ABNT",
  "Garantia de 1 ano no serviço",
  "Teste completo após instalação",
  "Orientação sobre uso correto",
  "Atendimento em toda Foz do Iguaçu",
  "Preços justos e transparentes",
  "Agendamento flexível"
]

const acTypes = [
  { 
    icon: Home, 
    title: "Split Residencial", 
    description: "Ideal para quartos, salas e escritórios. Modelos de 9.000 a 24.000 BTUs.",
    btus: "9.000 a 24.000 BTUs"
  },
  { 
    icon: Building2, 
    title: "Split Comercial", 
    description: "Para lojas, consultórios e pequenas empresas. Alta capacidade e durabilidade.",
    btus: "24.000 a 60.000 BTUs"
  },
  { 
    icon: ThermometerSnowflake, 
    title: "Multi-Split", 
    description: "Uma unidade externa para várias internas. Economia e praticidade.",
    btus: "Personalizado"
  },
  { 
    icon: Factory, 
    title: "Central / VRF", 
    description: "Soluções para grandes ambientes comerciais e industriais em Foz do Iguaçu.",
    btus: "Projeto sob medida"
  }
]

const steps = [
  { 
    step: "1", 
    title: "Visita Técnica", 
    description: "Avaliamos o ambiente, medimos o espaço e calculamos a capacidade ideal em BTUs para sua necessidade."
  },
  { 
    step: "2", 
    title: "Orçamento Detalhado", 
    description: "Apresentamos orçamento completo com equipamento, materiais e mão de obra. Sem surpresas!"
  },
  { 
    step: "3", 
    title: "Instalação Profissional", 
    description: "Nossa equipe realiza a instalação seguindo todas as normas técnicas e de segurança."
  },
  { 
    step: "4", 
    title: "Teste e Orientação", 
    description: "Testamos o funcionamento completo e orientamos sobre uso e manutenção do equipamento."
  }
]

export default function InstalacaoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Instalação de Ar Condicionado em Foz do Iguaçu",
    description: "Instalação profissional de ar condicionado split, multi-split e central em Foz do Iguaçu",
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
                  <Settings className="w-4 h-4" />
                  Instalação Profissional
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance">
                  Instalação de Ar Condicionado em <span className="text-primary">Foz do Iguaçu</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Imperial Ar Condicionado oferece instalação profissional de ar condicionado split, multi-split e 
                  sistemas centrais em Foz do Iguaçu. Nossa equipe de técnicos certificados garante uma instalação 
                  segura, eficiente e dentro das normas técnicas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/5545998382953?text=Olá! Gostaria de solicitar um orçamento para instalação de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Solicitar Orçamento
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
                    src="/images/tecnico-instalando.png"
                    alt="Técnico instalando ar condicionado em Foz do Iguaçu - Imperial Ar Condicionado"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre instalação */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Instalação de Ar Condicionado com Qualidade em Foz do Iguaçu
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Uma <strong>instalação correta de ar condicionado</strong> é fundamental para o bom funcionamento do equipamento, 
                  economia de energia e durabilidade do aparelho. Em Foz do Iguaçu, onde as temperaturas podem ser bastante elevadas 
                  durante o verão, ter um ar condicionado bem instalado faz toda a diferença no conforto da sua casa ou empresa.
                </p>
                <p>
                  A <strong>Imperial Ar Condicionado</strong> conta com técnicos experientes e certificados que realizam a instalação 
                  seguindo todas as normas da ABNT. Utilizamos materiais de primeira qualidade, como tubulação de cobre, cabos adequados 
                  e suportes resistentes, garantindo uma instalação segura e durável.
                </p>
                <p>
                  Atendemos toda <strong>Foz do Iguaçu e região</strong>, incluindo residências, apartamentos, casas, comércios, 
                  escritórios, clínicas, hotéis e empresas. Oferecemos orçamento gratuito e sem compromisso para que você possa 
                  planejar a climatização do seu ambiente com tranquilidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tipos de AC */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Tipos de Ar Condicionado que Instalamos em Foz do Iguaçu
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Trabalhamos com todas as principais marcas e modelos do mercado
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {acTypes.map((item, index) => (
                <Card key={index} className="border-border/50 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {item.btus}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Por que escolher a Imperial para instalar seu ar condicionado em Foz do Iguaçu?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Nossa experiência e compromisso com a qualidade fazem a diferença na sua instalação:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Garantia</h3>
                    <p className="text-sm text-muted-foreground">1 ano no serviço</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Agilidade</h3>
                    <p className="text-sm text-muted-foreground">Instalação rápida</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <Award className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Qualidade</h3>
                    <p className="text-sm text-muted-foreground">Materiais premium</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">Eficiência</h3>
                    <p className="text-sm text-muted-foreground">Economia de energia</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Como funciona a instalação de ar condicionado em Foz do Iguaçu
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Processo simples e transparente do início ao fim
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dicas BTU */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                Como escolher o ar condicionado ideal para Foz do Iguaçu?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A escolha da capacidade correta do ar condicionado (medida em BTUs) é essencial para garantir 
                  conforto térmico e economia de energia. Em <strong>Foz do Iguaçu</strong>, onde o clima é subtropical 
                  com verões quentes, é importante considerar alguns fatores:
                </p>
                <ul>
                  <li><strong>Tamanho do ambiente:</strong> Quanto maior o espaço, mais BTUs são necessários</li>
                  <li><strong>Incidência de sol:</strong> Ambientes com sol direto precisam de mais capacidade</li>
                  <li><strong>Número de pessoas:</strong> Cada pessoa adiciona cerca de 600 BTUs</li>
                  <li><strong>Equipamentos eletrônicos:</strong> Computadores e TVs geram calor adicional</li>
                </ul>
                <p>
                  Como referência geral para Foz do Iguaçu:
                </p>
                <ul>
                  <li>Até 10m²: 9.000 BTUs</li>
                  <li>10 a 15m²: 12.000 BTUs</li>
                  <li>15 a 20m²: 18.000 BTUs</li>
                  <li>20 a 30m²: 24.000 BTUs</li>
                  <li>Acima de 30m²: consulte nossos técnicos</li>
                </ul>
                <p>
                  A <strong>Imperial Ar Condicionado</strong> oferece visita técnica gratuita para calcular 
                  exatamente a capacidade ideal para seu ambiente em Foz do Iguaçu. Não arrisque comprar um 
                  equipamento inadequado!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Precisa instalar ar condicionado em Foz do Iguaçu?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Entre em contato com a Imperial Ar Condicionado e solicite seu orçamento gratuito. 
              Instalação profissional com garantia e os melhores preços da região.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5545998382953?text=Olá! Gostaria de solicitar um orçamento para instalação de ar condicionado em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
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
              <Link href="/manutencao-ar-condicionado-foz-do-iguacu" className="group">
                <Card className="border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <span className="font-medium text-foreground">Manutenção de Ar Condicionado</span>
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
