import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    // Endpoint correto do backend para obter PMOC específico
    const url = `${backendUrl.replace(/\/$/, "")}/api/pmocs/${id}`;

    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter PMOC" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/pmocs/${id}`;
    const body = await request.json();

    const res = await backendClient(url, body, {}, "PUT");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao atualizar PMOC" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/pmocs/${id}`;

    const res = await backendClient(url, {}, {}, "DELETE");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao deletar PMOC" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
