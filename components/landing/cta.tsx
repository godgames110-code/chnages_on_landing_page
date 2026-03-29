import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Snowflake } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-accent relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Snowflake className="absolute top-10 left-4 md:left-10 w-20 md:w-32 h-20 md:h-32 text-accent-foreground" />
        <Snowflake className="absolute bottom-10 right-4 md:right-10 w-16 md:w-24 h-16 md:h-24 text-accent-foreground" />
        <Snowflake className="absolute top-1/2 left-1/3 w-12 md:w-16 h-12 md:h-16 text-accent-foreground hidden sm:block" />
      </div>
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-accent-foreground mb-6">
          Precisa de um serviço de ar condicionado?
        </h2>
        <p className="text-lg text-accent-foreground/80 mb-10 max-w-2xl mx-auto">
          Entre em contato conosco agora mesmo e solicite seu orçamento sem compromisso. 
          Atendemos com rapidez e qualidade.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base"
            asChild
          >
            <a href="https://wa.me/5545998382953" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10 text-base bg-transparent"
            asChild
          >
            <a href="tel:+5545998382953">
              <Phone className="mr-2 h-5 w-5" />
              Ligar Agora
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
