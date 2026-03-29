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
 * GET /api/budget/stats - Obtém estatísticas dos orçamentos
 * Retorna: total, por status, valores totais, etc.
 */
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/budgets/stats`;

    console.debug(`[api/budget/stats] GET ${url}`);
    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      // Transformar dados do backend para o formato do frontend
      const transformedData = convertKeysToCamelCase(data);
      return NextResponse.json(transformedData);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter estatísticas de orçamentos" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
