import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json(
        { error: "Backend URL não configurado" },
        { status: 500 }
      );
    }
    // Corrigir endpoint para o esperado pelo backend
    const url = `${backendUrl.replace(/\/$/, "")}/api/pmocs/${id}/services`;
    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data);
    }
    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter serviços do ar-condicionado" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com backend" },
      { status: 502 }
    );
  }
}

// Este endpoint não deve mais ser usado para POST. O correto é usar /api/pmoc/[pmocId]/air-conditioners/[airConditionerId]/services
export const dynamic = "force-dynamic";
