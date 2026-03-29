import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

// fetch is available in the Node runtime used by Next route handlers
export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/transactions`;

  const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));


    if (!res.ok) {
      return NextResponse.json({ error: data.errors || data.message || "Erro ao obter transações" }, { status: res.status });
    }

    const items = Array.isArray(data) ? data : (data.transactions ?? data) || [];

    const looksLikeIso = (s: any) =>
      typeof s === "string" && /^\d{4}-\d{2}-\d{2}(T|$)/.test(s)

    const preferredIsoFor = (t: any) => {
      if (!t) return ""
      if (t.created_at) return t.created_at
      if (looksLikeIso(t.date)) return t.date
      return t.date || ""
    }

    // Normalize and sort by timestamp (newest first) using preferred ISO/raw date
    items.sort((a: any, b: any) => {
      const da = new Date(preferredIsoFor(a) || 0).getTime()
      const db = new Date(preferredIsoFor(b) || 0).getTime()
      return db - da
    })

    const transactions = items.map((t: any) => {
      const iso = preferredIsoFor(t) || ""
      let formatted = ""
      try {
        formatted = iso ? new Date(iso).toLocaleString() : (t.created_at ? new Date(t.created_at).toLocaleString() : "")
      } catch (e) {
        formatted = String(iso || t.created_at || t.date || "")
      }

      return {
        id: t.id,
        // prefer title as the visible name, fall back to description if title missing
        name: t.title ?? "",
        // keep the original description available to the UI
        description: t.description ?? "",
        amount: Number(t.value ?? t.amount ?? 0),
        // date remains the human-friendly string for display
        date: formatted,
        // include the ISO/raw date to allow robust sorting in the client
        dateIso: iso,
        type: (t.type === "IN" || t.type === "income") ? "income" : "expense",
        category: t.category ?? t.category_name ?? t.type ?? "",
      }
    })

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
