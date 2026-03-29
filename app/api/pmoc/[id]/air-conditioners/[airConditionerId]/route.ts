import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; airConditionerId: string }> }
) {
  try {
    const { id, airConditionerId } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }
    const url = `${backendUrl.replace(/\/$/, "")}/api/air-conditioners/${airConditionerId}`;
    const res = await backendClient(url, {}, {}, "DELETE");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao deletar ar-condicionado" },
      { status: res.status || 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; airConditionerId: string }> }
) {
  try {
    const { id, airConditionerId } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }
    const url = `${backendUrl.replace(/\/$/, "")}/api/air-conditioners/${airConditionerId}`;
    const body = await request.json();
    const res = await backendClient(url, body, {}, "PUT");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data);
    }
    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao atualizar ar-condicionado" },
      { status: res.status || 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}