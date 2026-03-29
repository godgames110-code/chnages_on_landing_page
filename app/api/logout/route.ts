
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function POST(req: NextRequest) {
	try {
		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
		if (!backendUrl) {
			console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
			return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
		}

		const url = `${backendUrl.replace(/\/$/, "")}/api/logout`;

		console.debug('[logout] chamando backend para invalidar token');
		
		// Envia para backend invalidar o token
		const res = await backendClient(url, {});
		const data = await res.json().catch(() => ({}));

		// Remove o cookie localmente
		const response = NextResponse.json(
			{ message: data.message || "Desconectado" },
			{ status: res.ok ? 200 : 400 }
		);

		// Remove cookie 'auth_token'
		response.cookies.set({
			name: "auth_token",
			value: "",
			httpOnly: true,
			path: "/",
			maxAge: 0,
		});

		console.info('[logout] cookie auth_token removido');

		return response;
	} catch (error) {
		console.error("Erro ao conectar com backend:", error);
		return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
	}
}

