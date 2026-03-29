import type { Budget } from "@/types/budget"

export function generateBudgetPdf(budget: Budget, userName?: string, hideValue: boolean = false, logoUrl?: string) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Calcula dias de validade
  const calculateValidityDays = (issueDate: string, validUntil: string) => {
    const issue = new Date(issueDate)
    const valid = new Date(validUntil)
    const diffTime = Math.abs(valid.getTime() - issue.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const servicesRows = budget.services
    .map(
      (service, index) => `
      <tr class="${index % 2 === 1 ? 'bg-gray-50' : ''} border-t">
        <td class="px-3 py-2">${service.description}</td>
        <td class="px-3 py-2 text-center">${service.quantity.toString().padStart(2, '0')}</td>
        <td class="px-3 py-2 text-right">${formatCurrency(service.unitPrice)}</td>
        <td class="px-3 py-2 text-right">${formatCurrency(service.totalPrice)}</td>
      </tr>
    `
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>${budget.documentTitle}</title>
      <script src="https://cdn.tailwindcss.com"></script>

      <style>
        @page {
          size: A4;
          margin: 2cm;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            background: #ffffff !important;
            color: #000000 !important;
          }

          .shadow,
          .shadow-lg {
            box-shadow: none !important;
          }

          .my-10 { margin: 0 !important; }
          .max-w-4xl { max-width: 100% !important; }
          .p-10 { padding: 0 !important; }

          table, section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>

    <body class="bg-gray-100 text-gray-900 font-sans">

      <div class="max-w-4xl mx-auto bg-white my-10 shadow-lg">

        <!-- Cabeçalho -->
        <header class="flex items-center justify-between px-10 py-6 border-b border-gray-300">
          <div>
            <h1 class="text-2xl font-semibold uppercase tracking-wide">
              ${budget.documentTitle}
            </h1>

          </div>

          <img src="${logoUrl}" alt="Imperial Ar Condicionado" class="h-16 object-contain" onerror="this.style.display='none'">
        </header>

        <main class="p-10 space-y-10">

          <!-- Dados da Empresa -->
          <section>
            <h2 class="text-sm font-semibold text-cyan-700 uppercase tracking-wide mb-3">
              Dados da Empresa
            </h2>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Empresa:</strong> ${budget.companyName}</p>
              <p><strong>CNPJ:</strong> ${budget.cnpj}</p>
              <p><strong>Telefone:</strong> ${budget.phone || 'Não informado'}</p>
              <p><strong>E-mail:</strong> ${budget.email || 'Não informado'}</p>
              <p class="col-span-2">
                <strong>Responsável Técnico:</strong> ${userName || budget.technicalResponsible || 'Não informado'}
              </p>
            </div>
          </section>

          <!-- Identificação -->
          <section>
            <h2 class="text-sm font-semibold text-cyan-700 uppercase tracking-wide mb-3">
              Informações do Orçamento
            </h2>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <p><strong>Data de Emissão:</strong> ${formatDate(budget.issueDate)}</p>
              <p><strong>Prazo de Validade:</strong> ${formatDate(budget.validUntil)}</p>
              <p class="col-span-2">
                <strong>Descrição Geral:</strong> ${budget.serviceDescription || 'Não informado'}
              </p>
            </div>
          </section>

          <!-- Serviços -->
          <section>
            <h2 class="text-sm font-semibold text-cyan-700 uppercase tracking-wide mb-3">
              Lista de Serviços
            </h2>

            <table class="w-full text-sm border border-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold">Descrição</th>
                  <th class="px-3 py-2 text-center font-semibold">Qtd</th>
                  <th class="px-3 py-2 text-right font-semibold">Valor Unitário</th>
                  <th class="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                ${servicesRows}
              </tbody>
              ${!hideValue ? `
              <tfoot>
                <tr class="border-t-2 border-gray-400 font-semibold">
                  <td colspan="3" class="px-3 py-3 text-right">
                    Valor Total
                  </td>
                  <td class="px-3 py-3 text-right text-cyan-700 text-base">
                    ${formatCurrency(budget.totalValue)}
                  </td>
                </tr>
              </tfoot>
              ` : ''}
            </table>
          </section>

          ${
            budget.observations
              ? `
          <!-- Observações -->
          <section>
            <h2 class="text-sm font-semibold text-cyan-700 uppercase tracking-wide mb-2">
              Observações e Condições
            </h2>
            <p class="text-sm text-justify text-gray-700">
              ${budget.observations}
            </p>
          </section>
          `
              : ''
          }

          <!-- Assinatura -->
          <section class="mt-16">
            <div class="w-80">
              <p class="border-t border-gray-500 pt-2 text-sm font-medium">
                Assinatura do Técnico
              </p>
            </div>
          </section>

        </main>
      </div>

    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}
