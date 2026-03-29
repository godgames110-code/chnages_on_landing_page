import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Imperial Ar Condicionado | PMOC, Instalacao, Limpeza e Manutencao de Ar Condicionado em Foz do Iguacu",
  description: "Especialistas em ar condicionado em Foz do Iguacu - PR. Instalacao de ar condicionado, limpeza de ar condicionado, manutencao e PMOC. Atendimento residencial e comercial com garantia. Solicite seu orcamento!",
  keywords: [
    "ar condicionado Foz do Iguacu",
    "PMOC Foz do Iguacu",
    "instalacao ar condicionado Foz do Iguacu",
    "instalacao de ar condicionado Foz do Iguacu",
    "manutencao ar condicionado Foz do Iguacu",
    "limpeza ar condicionado Foz do Iguacu",
    "limpeza de ar condicionado Foz do Iguacu",
    "higienizacao ar condicionado Foz do Iguacu",
    "climatizacao Foz do Iguacu",
    "ar condicionado split Foz do Iguacu",
    "tecnico ar condicionado Foz do Iguacu",
    "conserto ar condicionado Foz do Iguacu",
    "Imperial Ar Condicionado",
    "ar condicionado residencial Foz do Iguacu",
    "ar condicionado comercial Foz do Iguacu"
  ],
  authors: [{ name: "Imperial Ar Condicionado" }],
  creator: "Imperial Ar Condicionado",
  publisher: "Imperial Ar Condicionado",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://imperialarfoz.com.br",
    siteName: "Imperial Ar Condicionado",
    title: "Imperial Ar Condicionado | PMOC, Instalacao, Limpeza e Manutencao em Foz do Iguacu",
    description: "Especialistas em ar condicionado em Foz do Iguacu - PR. Instalacao, limpeza, manutencao e PMOC de ar condicionado com garantia.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Imperial Ar Condicionado - Climatização em Foz do Iguaçu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imperial Ar Condicionado | Instalacao, Limpeza e PMOC em Foz do Iguacu",
    description: "Especialistas em ar condicionado em Foz do Iguacu - PR. Instalacao, limpeza, manutencao e PMOC de ar condicionado.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://imperialarfoz.com.br",
  },
  icons: {
    icon: "/logo.png",
  },
  verification: {
    google: "seu-codigo-de-verificacao-google",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://imperialarfoz.com.br",
    name: "Imperial Ar Condicionado",
    description: "Especialistas em climatização em Foz do Iguaçu. Instalação, manutenção, limpeza e PMOC de ar condicionado.",
    url: "https://imperialarfoz.com.br",
    telephone: "+55-45-99838-2953",
    email: "imperialarcondicionado.foz@gmail.com",
    image: "/logo.png",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Foz do Iguaçu",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -25.5163,
      longitude: -54.5880,
    },
    areaServed: {
      "@type": "City",
      name: "Foz do Iguaçu",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    sameAs: [
      "https://www.instagram.com/imperial_ar_condicionado/",
      "https://www.facebook.com/imperialarfoz",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicos de Ar Condicionado em Foz do Iguacu",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PMOC em Foz do Iguacu",
            description: "Plano de Manutencao, Operacao e Controle de ar condicionado conforme legislacao em Foz do Iguacu",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Instalacao de Ar Condicionado em Foz do Iguacu",
            description: "Instalacao profissional de ar condicionado split e multi-split em Foz do Iguacu",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Manutencao de Ar Condicionado em Foz do Iguacu",
            description: "Manutencao preventiva e corretiva de sistemas de climatizacao em Foz do Iguacu",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Limpeza de Ar Condicionado em Foz do Iguacu",
            description: "Limpeza profissional e higienizacao completa de ar condicionado em Foz do Iguacu",
          },
        },
      ],
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
