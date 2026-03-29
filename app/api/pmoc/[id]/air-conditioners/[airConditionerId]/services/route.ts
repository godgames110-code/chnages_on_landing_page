import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; airConditionerId: string }> }
) {
  try {
    const { airConditionerId } = await context.params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json(
        { error: "Backend URL não configurado" },
        { status: 500 }
      );
    }
    const url = `${backendUrl.replace(/\/$/, "")}/api/air-conditioners/${airConditionerId}/services`;
    const body = await request.json();
    const res = await backendClient(url, body, {}, "POST");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data, { status: 201 });
    }
    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao criar serviço do ar-condicionado" },
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