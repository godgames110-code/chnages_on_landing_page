// Adaptado do frontendV2
export interface LaudoData {
  clientName: string
  clientDocument: string
  serviceAddress: string
  cleaningDate: string
  reportDate: string
  companyName: string
  companyDocument: string
  technicianName: string
  technicianRegistration: string
  technicianCpf: string
  companyLogoUrl: string | null
  equipments: Array<{ quantity: number; capacity: string; location: string }>
}

export function generateLaudoPdf(data: LaudoData) {
  // Formatar datas para BR
  const formatDateBR = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  // Calcular total de equipamentos
  const totalEquipments = data.equipments.reduce((sum, eq) => sum + eq.quantity, 0)

  // Gerar HTML do laudo
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Laudo Técnico de Limpeza</title>
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Configurações para impressão -->
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }

    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }

      .shadow-lg,
      .bg-gray-100 {
        box-shadow: none !important;
        background: transparent !important;
      }

      .my-10 {
        margin: 0 !important;
      }

      .p-10 {
        padding: 0 !important;
      }

      table {
        page-break-inside: avoid;
      }

      img {
        max-width: 100%;
      }
    }
  </style>
</head>

<body class="bg-gray-100 text-gray-800">

  <div class="max-w-4xl mx-auto bg-white p-10 my-10">

    <!-- Cabeçalho -->
    <div class="text-center border-b pb-6 mb-6">
      <h1 class="text-2xl font-bold uppercase">Laudo Técnico de Limpeza</h1>
      <p class="mt-2 text-sm">
        Conforme normas técnicas aplicáveis e boas práticas de higienização
      </p>
    </div>

    <!-- Identificação -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-4">1. Identificação</h2>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <p><strong>Cliente:</strong> ${data.clientName}</p>
        <p><strong>CNPJ:</strong> ${data.clientDocument}</p>

        <p class="col-span-2">
          <strong>Local do Serviço:</strong>
          ${data.serviceAddress}
        </p>

        <p><strong>Data da Limpeza:</strong> ${formatDateBR(data.cleaningDate)}</p>
        <p><strong>Data do Laudo:</strong> ${formatDateBR(data.reportDate)}</p>

        <p><strong>Empresa Executora:</strong> ${data.companyName}</p>
        <p><strong>CNPJ:</strong> ${data.companyDocument}</p>

        <p class="col-span-2">
          <strong>Responsável Técnico:</strong> ${data.technicianName} |
          <strong>TRT:</strong> ${data.technicianRegistration}
        </p>
      </div>
    </div>

    <!-- Equipamentos -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">2. Identificação dos Equipamentos Higienizados</h2>
      <p class="text-sm text-justify mb-3">
        Conforme vistoria e serviços executados, foram realizados procedimentos de limpeza
        e higienização nos seguintes equipamentos de ar-condicionado:
      </p>

      <table class="w-full border border-gray-400 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-3 py-2 text-left">Quantidade</th>
            <th class="border px-3 py-2 text-left">Capacidade (BTUs)</th>
            <th class="border px-3 py-2 text-left">Localização</th>
          </tr>
        </thead>
        <tbody>
          ${data.equipments.map(eq => `
            <tr>
              <td class="border px-3 py-2">${eq.quantity.toString().padStart(2, '0')}</td>
              <td class="border px-3 py-2">${eq.capacity}</td>
              <td class="border px-3 py-2">${eq.location}</td>
            </tr>
          `).join('')}
          <tr class="font-semibold">
            <td class="border px-3 py-2" colspan="3">
              Total: ${totalEquipments} (${totalEquipments === 1 ? 'uma' : 'unidades'}) unidade${totalEquipments === 1 ? '' : 's'} de ar-condicionado higienizada${totalEquipments === 1 ? '' : 's'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Objetivo -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">3. Objetivo</h2>
      <p class="text-sm text-justify">
        O presente laudo técnico tem como objetivo atestar a execução dos serviços de limpeza,
        higienização e conservação no local acima identificado.
      </p>
    </div>

    <!-- Avaliação -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">4. Avaliação Técnica</h2>
      <p class="text-sm text-justify">
        Após vistoria técnica realizada no local, constatou-se que os serviços foram executados
        conforme boas práticas, não sendo identificadas irregularidades aparentes.
      </p>
    </div>

    <!-- Conclusão -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">5. Conclusão</h2>
      <p class="text-sm text-justify">
        O ambiente encontra-se em condições adequadas de limpeza e conservação, estando apto
        para uso.
      </p>
    </div>

    <!-- Referências -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">6. Referências Normativas</h2>
      <ul class="text-sm list-disc list-inside space-y-2 text-justify">
        <li><strong>Portaria MS nº 3.523/1998</strong> — Regulamento técnico para sistemas de climatização.</li>
        <li><strong>Resolução ANVISA nº 09/2003</strong> — Padrões referenciais de qualidade do ar interior.</li>
      </ul>
    </div>

    <!-- Validade Técnica e Responsabilidade -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">7. Validade Técnica e Responsabilidade</h2>

      <p class="text-sm text-justify mb-3">
        O presente laudo refere-se exclusivamente à data da execução dos serviços
        descritos, possuindo caráter pontual e não continuado.
      </p>

      <p class="text-sm text-justify mb-3">
        Este documento não substitui o PMOC, conforme previsto na Portaria MS nº 3.523/1998.
      </p>

      <p class="text-sm text-justify">
        Recomenda-se, como boa prática técnica, a realização de nova higienização do
        sistema de ar-condicionado em até <strong>6 meses</strong>.
      </p>
    </div>

    <!-- Assinatura -->
    <div class="mt-10 flex justify-between items-end text-sm">
      <div>
        <p>__________________________________________</p>
        <p class="font-semibold">${data.technicianName}</p>
        <p>CPF: ${data.technicianCpf}</p>
        <p>Responsável Técnico</p>
      </div>

      <div class="text-center">
        <p class="text-xs mt-2">Código do Técnico Credenciado</p>
      </div>
    </div>

  </div>

</body>
</html>
  `

  // Abrir em nova janela e imprimir
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(htmlContent)
  win.document.close()
  win.print()
}
