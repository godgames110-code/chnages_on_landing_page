import { Button } from "@/components/ui/button"
import { Phone, Snowflake, Wind, ThermometerSnowflake } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="absolute top-32 left-4 md:left-10 opacity-10">
        <Snowflake className="w-16 h-16 md:w-24 md:h-24 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-32 right-4 md:right-10 opacity-10">
        <Wind className="w-20 h-20 md:w-32 md:h-32 text-primary animate-pulse" />
      </div>
      <div className="absolute top-1/2 right-1/4 opacity-5 hidden lg:block">
        <ThermometerSnowflake className="w-20 h-20 text-accent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Snowflake className="w-4 h-4" />
              Climatização em Foz do Iguaçu
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Ar Condicionado em{" "}
              <span className="text-primary">Foz do Iguaçu</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Imperial Ar Condicionado: especialistas em instalação, manutenção, limpeza e PMOC de ar condicionado em Foz do Iguaçu - PR. 
              Atendimento residencial e comercial com profissionais certificados e garantia de serviço.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <a href="https://wa.me/5545998382953" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" />
                  Solicitar Orçamento
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                <a href="#servicos">
                  Ver Serviços
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Clientes em Foz</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">6+</p>
                <p className="text-sm text-muted-foreground">Anos na região</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Satisfação garantida</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-6" />
              <div className="absolute inset-0 bg-accent/30 rounded-3xl transform -rotate-3" />
              <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/ar-split-ambiente.png"
                  alt="Instalação de ar condicionado split em Foz do Iguaçu - Imperial Ar Condicionado"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="Imperial Ar Condicionado Foz do Iguaçu"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
