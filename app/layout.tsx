import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Imperial Ar Condicionado | PMOC e Ar Condicionado em Foz do Iguaçu",
  description: "Especialistas em climatização em Foz do Iguaçu - PR. Instalação, manutenção, limpeza e PMOC de ar condicionado. Atendimento residencial e comercial com garantia. Solicite seu orçamento!",
  keywords: [
    "ar condicionado Foz do Iguaçu",
    "PMOC Foz do Iguaçu",
    "instalação ar condicionado Foz do Iguaçu",
    "manutenção ar condicionado Foz do Iguaçu",
    "limpeza ar condicionado Foz do Iguaçu",
    "climatização Foz do Iguaçu",
    "ar condicionado split",
    "técnico ar condicionado",
    "conserto ar condicionado Foz",
    "Imperial Ar Condicionado"
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
    title: "Imperial Ar Condicionado | PMOC e Ar Condicionado em Foz do Iguaçu",
    description: "Especialistas em climatização em Foz do Iguaçu - PR. Instalação, manutenção, limpeza e PMOC de ar condicionado com garantia.",
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
    title: "Imperial Ar Condicionado | PMOC e Ar Condicionado em Foz do Iguaçu",
    description: "Especialistas em climatização em Foz do Iguaçu - PR. Instalação, manutenção, limpeza e PMOC de ar condicionado.",
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
      name: "Serviços de Ar Condicionado",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PMOC - Plano de Manutenção",
            description: "Plano de Manutenção, Operação e Controle de ar condicionado conforme legislação",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Instalação de Ar Condicionado",
            description: "Instalação profissional de ar condicionado split e multi-split",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Manutenção de Ar Condicionado",
            description: "Manutenção preventiva e corretiva de sistemas de climatização",
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
