// Proxy route: returns aggregated transaction info (balance, income, expenses)
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function POST(request: NextRequest) {
	try {
		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
		if (!backendUrl) {
			console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
			return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
		}

		const url = `${backendUrl.replace(/\/$/, "")}/api/balance`;

		const res = await backendClient(url, {});
		const data = await res.json().catch(() => ({}));

		if (res.ok) {
			// backend returns { in, out, balance }
			return NextResponse.json({
				balance: data.balance ?? 0,
				income: data.in ?? 0,
				expenses: data.out ?? 0,
			});
		}

		return NextResponse.json({ error: data.errors || data.message || "Erro ao obter dados" }, { status: res.status });
	} catch (error) {
		console.error("Erro ao conectar com backend:", error);
		return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
	}
}

