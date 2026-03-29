import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Imperial Ar Condicionado Foz do Iguaçu"
              width={150}
              height={50}
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-sm text-gray-400">
              Imperial Ar Condicionado: especialistas em climatização em Foz do Iguaçu - PR. 
              Instalação, manutenção, PMOC e limpeza de ar condicionado com garantia.
            </p>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-4">Serviços em Foz do Iguaçu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pmoc-foz-do-iguacu" className="text-sm text-gray-400 hover:text-white transition-colors">
                  PMOC em Foz do Iguaçu
                </Link>
              </li>
              <li>
                <Link href="/instalacao-ar-condicionado-foz-do-iguacu" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Instalação de Ar Condicionado
                </Link>
              </li>
              <li>
                <Link href="/manutencao-ar-condicionado-foz-do-iguacu" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Manutenção de Ar Condicionado
                </Link>
              </li>
              <li>
                <Link href="/limpeza-ar-condicionado-foz-do-iguacu" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Limpeza de Ar Condicionado
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato em Foz do Iguaçu</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+5545998382953" className="hover:text-white transition-colors">
                  (45) 99838-2953
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 mt-0.5" />
                <a href="mailto:imperialarcondicionado.foz@gmail.com" className="break-all hover:text-white transition-colors">
                  imperialarcondicionado.foz@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Foz do Iguaçu - PR, Brasil</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/imperialarfoz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook Imperial Ar Condicionado">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/imperial_ar_condicionado/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram Imperial Ar Condicionado">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-2">Área de Atendimento</h4>
              <p className="text-sm text-gray-400">
                Foz do Iguaçu, Santa Terezinha de Itaipu, São Miguel do Iguaçu e região.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Imperial Ar Condicionado - Foz do Iguaçu, PR. Todos os direitos reservados.</p>
          <p className="mt-2">
            <Link href="/pmoc-foz-do-iguacu" className="hover:text-white transition-colors">PMOC</Link>
            {" | "}
            <Link href="/instalacao-ar-condicionado-foz-do-iguacu" className="hover:text-white transition-colors">Instalacao</Link>
            {" | "}
            <Link href="/manutencao-ar-condicionado-foz-do-iguacu" className="hover:text-white transition-colors">Manutencao</Link>
            {" | "}
            <Link href="/limpeza-ar-condicionado-foz-do-iguacu" className="hover:text-white transition-colors">Limpeza</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
