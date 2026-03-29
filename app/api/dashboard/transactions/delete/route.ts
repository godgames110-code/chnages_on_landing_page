// Proxy route: DELETE a transaction on the backend. This route expects a POST from the client
// with a JSON body containing { id: string | number } and forwards a DELETE to the backend.
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // validate required id
    const id = body?.id ?? body?.transactionId;
    if (!id) {
      return NextResponse.json({ error: "Missing transaction id" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/transactions`;

    // Backend expects id in the JSON body for DELETE
    const res = await backendClient(url, { id }, {}, "DELETE");
    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}


