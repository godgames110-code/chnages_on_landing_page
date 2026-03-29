import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

/**
 * Converte snake_case para camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Converte objeto de snake_case para camelCase recursivamente
 */
function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = toCamelCase(key);
      result[camelKey] = convertKeysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

/**
 * Transforma dados do backend para o formato esperado pelo frontend
 */
function transformBudgetData(budget: any): any {
  const transformed = {
    ...budget,
    // Adicionar campos que o frontend espera mas não vem do backend
    companyName: budget.technician?.company_name || budget.technician?.companyName || '',
    cnpj: budget.technician?.company_document || budget.technician?.companyDocument || '',
    phone: budget.technician?.phone || '',
    email: budget.technician?.email || '',
    technicalResponsible: budget.technician?.name || 'Não informado',
  };

  return convertKeysToCamelCase(transformed);
}

/**
 * GET /api/budget/list - Alias para listar todos os orçamentos
 * (Mantém compatibilidade com padrão similar ao pmoc/list)
 */
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    // Endpoint do backend para listar orçamentos
    const url = `${backendUrl.replace(/\/$/, "")}/api/budgets`;

    console.debug(`[api/budget/list] GET ${url}`);
    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Transformar dados do backend para o formato do frontend
      const transformedData = Array.isArray(data) 
        ? data.map(transformBudgetData)
        : data;
      
      return NextResponse.json(transformedData);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter a lista de orçamentos" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
