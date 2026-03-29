import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

/**
 * Converte uma string de snake_case para camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converte recursivamente todas as chaves de um objeto de snake_case para camelCase
 */
function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  
  return obj;
}

/**
 * Transforma os dados do budget do backend para o formato esperado pelo frontend
 */
function transformBudgetData(budget: any): any {
  // Primeiro converte todas as chaves para camelCase
  const transformed = { ...budget };
  
  // Se existe objeto technician, extrair os campos para o nível superior
  if (budget.technician) {
    transformed.companyName = budget.technician.company_name || budget.technician.companyName;
    transformed.cnpj = budget.technician.company_document || budget.technician.cnpj;
    transformed.technicalResponsible = budget.technician.company_name || budget.technician.companyName;
    delete transformed.technician;
  }

  return convertKeysToCamelCase(transformed);
}

/**
 * GET /api/budget/[id] - Obtém um orçamento específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const { id } = await params;
    const url = `${backendUrl.replace(/\/$/, "")}/api/budgets/${id}`;

    console.debug(`[api/budget/[id]] GET ${url}`);
    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Transformar dados do backend para o formato do frontend
      const transformedData = transformBudgetData(data);
      return NextResponse.json(transformedData);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter orçamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

/**
 * PUT /api/budget/[id] - Atualiza um orçamento
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const { id } = await params;
    const url = `${backendUrl.replace(/\/$/, "")}/api/budgets/${id}`;
    const body = await request.json();

    console.debug(`[api/budget/[id]] PUT ${url}`);
    const res = await backendClient(url, body, {}, "PUT");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Transformar dados do backend para o formato do frontend
      const transformedData = transformBudgetData(data);
      return NextResponse.json(transformedData);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao atualizar orçamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

/**
 * DELETE /api/budget/[id] - Deleta um orçamento
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const { id } = await params;
    const url = `${backendUrl.replace(/\/$/, "")}/api/budgets/${id}`;

    console.debug(`[api/budget/[id]] DELETE ${url}`);
    const res = await backendClient(url, {}, {}, "DELETE");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao deletar orçamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
