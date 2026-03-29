import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

const benefits = [
  "Profissionais treinados e certificados",
  "Atendimento em Foz do Iguaçu e região",
  "Orçamento sem compromisso",
  "Preços justos e competitivos",
  "Garantia em todos os serviços",
  "Peças originais e de qualidade",
]

export function About() {
  return (
    <section id="sobre" className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative px-6 lg:px-0">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/tecnico-manutencao.png"
                alt="Técnico realizando manutenção de ar condicionado em Foz do Iguaçu"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-0 md:-left-6 rounded-2xl overflow-hidden shadow-xl w-32 md:w-48 aspect-square">
              <Image
                src="/images/tecnico-instalando.png"
                alt="Instalação de ar condicionado split em Foz do Iguaçu"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-0 md:-right-6 bg-primary text-primary-foreground rounded-2xl p-4 md:p-6 shadow-xl">
              <p className="text-3xl md:text-4xl font-bold">6+</p>
              <p className="text-xs md:text-sm">Anos em Foz do Iguaçu</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Por que escolher a Imperial Ar Condicionado em Foz do Iguaçu?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Somos especialistas em climatização com mais de 6 anos de experiência atendendo Foz do Iguaçu e região. 
                Nossa equipe é composta por técnicos certificados e comprometidos em entregar 
                o melhor serviço de ar condicionado para residências, comércios e empresas na cidade.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-muted rounded-xl p-6">
              <p className="text-foreground italic">
                &ldquo;Nossa missão é proporcionar conforto térmico com excelência para todos os moradores e empresas de Foz do Iguaçu, 
                garantindo a satisfação total de nossos clientes em cada serviço de ar condicionado realizado.&rdquo;
              </p>
              <p className="text-primary font-semibold mt-4">— Imperial Ar Condicionado, Foz do Iguaçu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
