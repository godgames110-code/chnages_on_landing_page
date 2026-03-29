import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Maria Silva",
    role: "Residência em Foz do Iguaçu",
    content: "Excelente serviço de instalação de ar condicionado! A equipe da Imperial foi muito profissional e pontual. O ar condicionado ficou perfeito e funcionando perfeitamente. Recomendo para todos em Foz do Iguaçu!",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Empresa em Foz do Iguaçu",
    content: "Contratamos a Imperial para PMOC e manutenção de toda nossa empresa em Foz do Iguaçu. Preço justo e atendimento impecável. O serviço de ar condicionado deles é o melhor da cidade!",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "Residência em Foz do Iguaçu",
    content: "Muito satisfeita com a limpeza e manutenção do meu ar condicionado. Agora o ar está muito mais fresco e puro. A Imperial é a melhor opção de ar condicionado em Foz do Iguaçu!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes em Foz do Iguaçu dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            A satisfação de nossos clientes em Foz do Iguaçu é nossa maior conquista. 
            Confira alguns depoimentos de quem já utilizou nossos serviços de ar condicionado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative border-border/50">
              <CardContent className="pt-8 pb-6">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
