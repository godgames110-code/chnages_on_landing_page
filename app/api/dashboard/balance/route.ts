// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";


export async function POST(request: NextRequest) {
  try{
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }
    
    const url = `${backendUrl.replace(/\/$/, "")}/api/balance/monthly`;

  // Use centralized helper. The backend accepts GET for this read-only endpoint.
  const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

  // response forwarded

    if (res.ok) {
      // Map backend fields: { in, out, balance } -> { balance, income, expenses }
      return NextResponse.json({
        balance: data.balance,
        income: data.in ?? data["in"] ?? 0,
        expenses: data.expenses ?? data["out"] ?? 0,
      });
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter o saldo" },
      { status: res.status || 400 }
    );

  }
  catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}


