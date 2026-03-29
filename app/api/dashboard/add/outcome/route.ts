import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

// Proxy route for OUT transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const payload = {
      type: "OUT",
      title: body.title || body.name || body.transactionName || "",
      description: body.description || "",
      amount: Number(body.amount ?? body.value ?? 0),
      date: body.date || new Date().toISOString(),
      category: body.category || "",
    };

  const url = `${backendUrl.replace(/\/$/, "")}/api/transactions`;

  console.log("[route:add:outcome] payload:", payload);

  const res = await backendClient(url, payload);
  const data = await res.json().catch(() => ({}));

  console.log("[route:add:outcome] backend status:", res.status);
  console.log("[route:add:outcome] backend body:", data);

  return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
