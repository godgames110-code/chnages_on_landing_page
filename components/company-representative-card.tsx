import { Card } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { maskCNPJ, maskPhone } from "@/lib/masks"

interface CompanyRepresentativeCardProps {
  company: {
    representative: {
      name: string
      role: string
      phone: string
      photo: string
      cnpj?: string
    }
  }
}

export default function CompanyRepresentativeCard({ company }: CompanyRepresentativeCardProps) {
  const rep = company.representative

  return (
    <Card className="p-6 text-center">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary bg-muted">
          <img src={rep.photo || "/placeholder.svg"} alt={rep.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Nome e Cargo */}
      <h3 className="text-lg font-semibold text-foreground">{rep.name}</h3>
      {/* Cargo removido */}

      {/* Divisor */}
      <div className="my-4 border-t border-border"></div>

      {/* Contatos */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
          <a href={`tel:${rep.phone}`} className="text-primary hover:underline break-all">
            {maskPhone(rep.phone || "")}
          </a>
        </div>
        {rep.cnpj && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">CNPJ:</span>
            <span className="text-primary">{maskCNPJ(rep.cnpj)}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
