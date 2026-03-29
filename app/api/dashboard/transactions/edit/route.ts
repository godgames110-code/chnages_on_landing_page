// Proxy route: EDIT a transaction on the backend.
// This route expects a POST from the client with a JSON body containing the transaction
// fields to update and an `id` (or `transactionId`). It maps frontend field names to the
// backend expected shape and forwards a PUT to the backend using `backendClient`.
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

    const url = `${backendUrl.replace(/\/$/, "")}/api/transactions/${encodeURIComponent(id)}`;

    // Map frontend form fields -> backend expected fields.
    // Frontend uses: title, amount, date, category, description, type (optional)
    // Backend expects: title, value, date, category, description, type
    const payload: Record<string, unknown> = {};
    if (body.title ?? body.name) payload.title = body.title ?? body.name;
    if (body.amount ?? body.value) payload.value = Number(body.amount ?? body.value ?? 0);
    if (body.date) payload.date = body.date;
    if (body.category) payload.category = body.category;
    if (body.description) payload.description = body.description;
    if (body.type) payload.type = body.type;

    // If client passed additional backend-compatible fields, include them (safe passthrough)
    // but avoid overriding id
    for (const [k, v] of Object.entries(body)) {
      if (["id", "transactionId"].includes(k)) continue;
      if (!(k in payload)) payload[k] = v;
    }

    // send PUT with the payload to update the transaction
    const res = await backendClient(url, payload, {}, "PUT");
    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}


