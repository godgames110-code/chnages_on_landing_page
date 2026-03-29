import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Sparkles, Settings, ShieldCheck, Zap, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const services = [
  {
    icon: Settings,
    title: "Instalação de Ar Condicionado em Foz do Iguaçu",
    description: "Instalação profissional de ar condicionado split, multi-split e outros modelos em Foz do Iguaçu com garantia de serviço.",
    image: "/images/tecnico-instalando.png",
    href: "/instalacao-ar-condicionado-foz-do-iguacu",
  },
  {
    icon: Wrench,
    title: "Manutenção de Ar Condicionado em Foz do Iguaçu",
    description: "Manutenção preventiva e corretiva para garantir o funcionamento ideal do seu equipamento em Foz do Iguaçu.",
    image: "/images/tecnico-manutencao.png",
    href: "/manutencao-ar-condicionado-foz-do-iguacu",
  },
  {
    icon: FileText,
    title: "PMOC em Foz do Iguaçu",
    description: "Plano de Manutenção, Operação e Controle conforme legislação. Laudos técnicos e relatórios para sua empresa.",
    image: "/images/limpeza-ar.png",
    href: "/pmoc-foz-do-iguacu",
  },
  {
    icon: Sparkles,
    title: "Limpeza de Ar Condicionado",
    description: "Higienização profunda dos filtros e componentes para um ar mais puro e saudável em Foz do Iguaçu.",
    image: "/images/limpeza-ar.png",
    href: "/manutencao-ar-condicionado-foz-do-iguacu",
  },
  {
    icon: Zap,
    title: "Conserto e Reparo",
    description: "Diagnóstico e reparo de problemas técnicos com peças originais e garantia em Foz do Iguaçu.",
    image: "/images/unidade-externa.png",
    href: "/manutencao-ar-condicionado-foz-do-iguacu",
  },
  {
    icon: ShieldCheck,
    title: "Garantia de Serviço",
    description: "Todos os nossos serviços em Foz do Iguaçu possuem garantia para sua total tranquilidade.",
    image: "/images/equipamentos.png",
    href: "#contato",
  },
]

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Serviços de Ar Condicionado em Foz do Iguaçu
          </h2>
          <p className="text-lg text-muted-foreground">
            A Imperial Ar Condicionado oferece soluções completas em climatização para residências e empresas em Foz do Iguaçu e região, 
            com profissionais qualificados e equipamentos de qualidade.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link href={service.href} key={index}>
              <Card 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden h-full"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-primary/90 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <CardHeader className="pt-4">
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
