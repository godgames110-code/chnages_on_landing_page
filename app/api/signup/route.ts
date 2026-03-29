// app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Log de entrada (não logar senha)
    console.info("[signup] nova requisição de registro", { name, email });
    console.debug(`[api/signup] payload keys: ${Object.keys(body).join(",")}`);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("[signup] NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/register`;

    // Chamada ao backend: log antes/tempo
  console.debug(`[signup] chamando backend ${url} para ${email}`);
  const start = Date.now();
  const res = await backendClient(url, { name, email, password });
  const duration = Date.now() - start;

    // tenta parsear body da resposta com fallback
    const data = await res.json().catch(() => ({}));

    // Remove password do log (nunca deve estar presente, mas por segurança)
    const safeData = data && typeof data === "object" 
      ? Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'password'))
      : data;

    console.debug(`[signup] resposta do backend status=${res.status} duration=${duration}ms`, {
      ok: res.ok,
      status: res.status,
      body: safeData,
    });

    if (res.ok && data.token) {
      console.info("[signup] registro bem sucedido para", email);
      const response = NextResponse.json({ message: "Conta criada com sucesso!" });

      // Salva token em cookie HttpOnly
      response.cookies.set({
        name: "auth_token",
        value: data.token,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      console.info(`[api/signup] cookie auth_token set for ${email} (httpOnly)`);

      return response;
    }

    console.warn("[signup] falha ao registrar", { status: res.status, errors: data.errors || data.message });
    return NextResponse.json({ error: data.errors || data.message || "Erro ao registrar" }, { status: 400 });
  } catch (error) {
    console.error("[signup] erro interno ao processar requisição:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
