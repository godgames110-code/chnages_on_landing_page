"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que é PMOC e por que preciso em Foz do Iguaçu?",
    answer: "PMOC significa Plano de Manutenção, Operação e Controle. É um documento obrigatório por lei (Lei 13.589/2018) para ambientes climatizados em Foz do Iguaçu e em todo Brasil. O PMOC garante a qualidade do ar interno, previne doenças respiratórias e evita multas. A Imperial Ar Condicionado oferece elaboração e execução de PMOC completo para empresas em Foz do Iguaçu."
  },
  {
    question: "Quem precisa de PMOC em Foz do Iguaçu?",
    answer: "Em Foz do Iguaçu, todos os estabelecimentos com ambientes climatizados e de uso coletivo precisam de PMOC: hotéis, restaurantes, clínicas, escritórios, comércios, escolas, academias e outros. O não cumprimento pode resultar em multas e interdição. A Imperial Ar Condicionado atende empresas de todos os portes em Foz do Iguaçu e região."
  },
  {
    question: "Quanto custa instalar ar condicionado em Foz do Iguaçu?",
    answer: "O custo de instalação de ar condicionado em Foz do Iguaçu varia conforme o modelo, capacidade (BTUs) e complexidade da instalação. A Imperial Ar Condicionado oferece orçamento gratuito e sem compromisso. Entre em contato pelo WhatsApp (45) 99838-2953 para uma avaliação personalizada."
  },
  {
    question: "Com que frequência devo fazer manutenção do ar condicionado?",
    answer: "Recomendamos manutenção preventiva a cada 3 a 6 meses para ar condicionado residencial em Foz do Iguaçu. Para uso comercial intenso, a manutenção pode ser mensal. A limpeza regular dos filtros pode ser feita quinzenalmente. A Imperial Ar Condicionado oferece planos de manutenção com valores especiais para clientes em Foz do Iguaçu."
  },
  {
    question: "Vocês atendem em toda Foz do Iguaçu?",
    answer: "Sim! A Imperial Ar Condicionado atende toda Foz do Iguaçu e região, incluindo Santa Terezinha de Itaipu, São Miguel do Iguaçu e cidades vizinhas. Nosso atendimento é de segunda a segunda, com horários flexíveis para melhor atender você."
  },
  {
    question: "Quais marcas de ar condicionado vocês trabalham em Foz do Iguaçu?",
    answer: "Trabalhamos com todas as principais marcas de ar condicionado em Foz do Iguaçu: LG, Samsung, Daikin, Carrier, Springer, Midea, Electrolux, Consul, Fujitsu e outras. Instalação, manutenção e reparo com peças originais e garantia."
  },
  {
    question: "Qual a diferença entre manutenção preventiva e corretiva?",
    answer: "A manutenção preventiva é realizada periodicamente para evitar problemas, incluindo limpeza, verificação e ajustes. A manutenção corretiva é feita quando já há um defeito ou mau funcionamento. A Imperial Ar Condicionado em Foz do Iguaçu recomenda sempre a preventiva para economizar e prolongar a vida útil do equipamento."
  },
  {
    question: "Vocês emitem nota fiscal e garantia em Foz do Iguaçu?",
    answer: "Sim! Todos os serviços da Imperial Ar Condicionado em Foz do Iguaçu incluem nota fiscal e garantia. Trabalhamos de forma regularizada e transparente, garantindo sua segurança e tranquilidade."
  }
]

export function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <section id="faq" className="py-24 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes sobre Ar Condicionado em Foz do Iguaçu
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre nossos serviços de climatização em Foz do Iguaçu
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 data-[state=open]:bg-muted/50"
            >
              <AccordionTrigger className="text-left text-foreground hover:no-underline py-6">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
