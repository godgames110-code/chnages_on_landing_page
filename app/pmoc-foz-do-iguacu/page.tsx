import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { 
  Phone, 
  FileText, 
  CheckCircle2, 
  Shield, 
  AlertTriangle,
  Building2,
  Users,
  Stethoscope,
  GraduationCap,
  Hotel,
  ShoppingBag,
  MessageCircle,
  ArrowRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "PMOC em Foz do Iguaçu | Plano de Manutenção de Ar Condicionado - Imperial",
  description: "PMOC em Foz do Iguaçu: Plano de Manutenção, Operação e Controle de ar condicionado. Atendemos empresas, hotéis, clínicas e comércios. Laudos técnicos e conformidade com a Lei 13.589. Solicite orçamento!",
  keywords: [
    "PMOC Foz do Iguaçu",
    "plano de manutenção ar condicionado",
    "PMOC empresas",
    "lei 13589 Foz do Iguaçu",
    "manutenção preventiva ar condicionado",
    "laudo técnico ar condicionado",
    "qualidade do ar interior"
  ],
  openGraph: {
    title: "PMOC em Foz do Iguaçu | Imperial Ar Condicionado",
    description: "Plano de Manutenção, Operação e Controle de ar condicionado em Foz do Iguaçu. Conformidade com a legislação e garantia de qualidade do ar.",
    type: "website",
    locale: "pt_BR",
  },
  alternates: {
    canonical: "https://imperialarfoz.com.br/pmoc-foz-do-iguacu",
  },
}

const benefits = [
  "Conformidade com a Lei 13.589/2018",
  "Melhoria da qualidade do ar interior",
  "Prevenção de doenças respiratórias",
  "Redução do consumo de energia",
  "Aumento da vida útil dos equipamentos",
  "Evita multas e interdições",
  "Laudos técnicos completos",
  "Registro de todas as manutenções"
]

const whoNeeds = [
  { icon: Hotel, title: "Hotéis e Pousadas", description: "Obrigatório para hospedagem em Foz do Iguaçu" },
  { icon: Building2, title: "Escritórios e Empresas", description: "Ambientes corporativos climatizados" },
  { icon: Stethoscope, title: "Clínicas e Hospitais", description: "Essencial para ambientes de saúde" },
  { icon: ShoppingBag, title: "Comércios e Lojas", description: "Estabelecimentos com ar condicionado" },
  { icon: GraduationCap, title: "Escolas e Universidades", description: "Ambientes educacionais climatizados" },
  { icon: Users, title: "Academias e Clubes", description: "Locais de uso coletivo" }
]

export default function PMOCPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "PMOC em Foz do Iguaçu",
    description: "Plano de Manutenção, Operação e Controle de ar condicionado em Foz do Iguaçu",
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
                  <FileText className="w-4 h-4" />
                  Conformidade Legal
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance">
                  PMOC em <span className="text-primary">Foz do Iguaçu</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  O PMOC (Plano de Manutenção, Operação e Controle) é obrigatório por lei para todos os ambientes climatizados 
                  de uso coletivo em Foz do Iguaçu. A Imperial Ar Condicionado oferece elaboração e execução completa do PMOC 
                  para sua empresa, garantindo conformidade com a legislação e qualidade do ar interior.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/5545998382953?text=Olá! Gostaria de solicitar um orçamento para PMOC em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Solicitar Orçamento PMOC
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
                    alt="Técnico realizando PMOC em Foz do Iguaçu - Imperial Ar Condicionado"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O que é PMOC */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center">
                O que é o PMOC e por que é obrigatório em Foz do Iguaçu?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  O <strong>PMOC (Plano de Manutenção, Operação e Controle)</strong> é um documento técnico obrigatório estabelecido pela 
                  <strong> Lei Federal 13.589/2018</strong> e regulamentado pela <strong>ANVISA através da RE nº 9/2003</strong>. 
                  Em Foz do Iguaçu, assim como em todo o Brasil, todos os estabelecimentos com ambientes climatizados artificialmente 
                  e de uso coletivo devem possuir e executar o PMOC.
                </p>
                <p>
                  O objetivo principal do PMOC é garantir a <strong>qualidade do ar interior</strong>, prevenindo a proliferação de 
                  fungos, bactérias e outros agentes contaminantes nos sistemas de climatização. Em Foz do Iguaçu, cidade turística 
                  com grande número de hotéis, restaurantes e estabelecimentos comerciais, o PMOC é especialmente importante para 
                  garantir a saúde de moradores e visitantes.
                </p>
                <p>
                  A <strong>Imperial Ar Condicionado</strong> é especializada em elaboração e execução de PMOC em Foz do Iguaçu, 
                  oferecendo um serviço completo que inclui: análise técnica dos equipamentos, elaboração do plano de manutenção, 
                  execução das manutenções programadas, emissão de laudos técnicos e ART (Anotação de Responsabilidade Técnica).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quem precisa */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Quem precisa de PMOC em Foz do Iguaçu?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Todos os estabelecimentos com ambientes climatizados e de uso coletivo em Foz do Iguaçu precisam de PMOC
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whoNeeds.map((item, index) => (
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

        {/* Benefícios */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Benefícios do PMOC para sua empresa em Foz do Iguaçu
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Além de cumprir a legislação, o PMOC traz diversos benefícios para seu estabelecimento em Foz do Iguaçu:
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
              <div className="relative">
                <Card className="border-border/50 bg-destructive/5 border-destructive/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Atenção: Multas e Penalidades
                        </h3>
                        <p className="text-muted-foreground">
                          Estabelecimentos em Foz do Iguaçu sem PMOC estão sujeitos a multas que podem variar de 
                          R$ 2.000 a R$ 1.500.000, além de interdição do local pela Vigilância Sanitária. 
                          Não arrisque seu negócio!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-primary/5 border-primary/20 mt-4">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Shield className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Garantia Imperial
                        </h3>
                        <p className="text-muted-foreground">
                          Com a Imperial Ar Condicionado, sua empresa em Foz do Iguaçu fica 100% em conformidade 
                          com a legislação. Emitimos todos os documentos necessários, incluindo ART.
                        </p>
                      </div>
                    </div>
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
              Como funciona o PMOC da Imperial em Foz do Iguaçu
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Processo simples e completo para deixar sua empresa em conformidade
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Vistoria Técnica", description: "Análise completa dos equipamentos e instalações" },
                { step: "2", title: "Elaboração do PMOC", description: "Criação do plano personalizado para sua empresa" },
                { step: "3", title: "Execução", description: "Manutenções programadas conforme o plano" },
                { step: "4", title: "Documentação", description: "Emissão de laudos, relatórios e ART" }
              ].map((item, index) => (
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

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Precisa de PMOC em Foz do Iguaçu?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              A Imperial Ar Condicionado é especialista em PMOC em Foz do Iguaçu. 
              Entre em contato agora e solicite seu orçamento sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="https://wa.me/5545998382953?text=Olá! Gostaria de solicitar um orçamento para PMOC em Foz do Iguaçu." target="_blank" rel="noopener noreferrer">
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
              <Link href="/instalacao-ar-condicionado-foz-do-iguacu" className="group">
                <Card className="border-border/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <span className="font-medium text-foreground">Instalação de Ar Condicionado</span>
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
