import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Services } from "@/components/landing/services"
import { About } from "@/components/landing/about"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Contact } from "@/components/landing/contact"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}
