import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    // Get query parameters if any (e.g., status, type filters)
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${backendUrl.replace(/\/$/, "")}/api/services${queryString ? `?${queryString}` : ''}`;

    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter serviços" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/services`;
    const body = await request.json();

    const res = await backendClient(url, body, {}, "POST");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao criar serviço" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
