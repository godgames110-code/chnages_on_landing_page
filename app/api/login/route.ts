// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.info(`[api/login] nova requisição de login`, { email });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/login`;

    console.debug(`[api/login] chamando backend ${url} para ${email}`);
    const start = Date.now();
    const res = await backendClient(url, { email, password });
    const duration = Date.now() - start;
    console.debug(`[api/login] backend response status=${res.status} duration=${duration}ms`);

    const data = await res.json().catch(() => ({}));
    
    // Remove password do log (nunca deve estar presente, mas por segurança)
    const safeData = data && typeof data === "object" 
      ? Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'password'))
      : data;
    
    console.debug(`[api/login] backend response body (sanitized):`, safeData);

    if (res.ok && data.token) {
      const response = NextResponse.json({ message: "Login bem-sucedido" });

      // Salva token em cookie HttpOnly
      response.cookies.set({
        name: "auth_token",
        value: data.token,
        httpOnly: true,
        secure: false, // Desabilitado para permitir HTTP (use HTTPS em produção real)
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      console.info(`[api/login] cookie auth_token set for ${email} (httpOnly)`);

      return response;
    }

    // Traduz e torna a mensagem mais amigável
    let errorMessage = "Email ou senha podem estar incorretos";
    
    if (data.error || data.errors || data.message) {
      const backendError = data.error || data.errors || data.message;
      
      // Traduz erros comuns do backend
      if (typeof backendError === 'string') {
        if (backendError.toLowerCase().includes('invalid') || 
            backendError.toLowerCase().includes('incorret') ||
            backendError.toLowerCase().includes('wrong')) {
          errorMessage = "Email ou senha podem estar incorretos";
        } else if (backendError.toLowerCase().includes('not found')) {
          errorMessage = "Email ou senha podem estar incorretos";
        } else if (backendError.toLowerCase().includes('required')) {
          errorMessage = "Por favor, preencha todos os campos";
        } else {
          errorMessage = "Ocorreu um erro ao tentar fazer login";
        }
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Não foi possível conectar ao servidor. Tente novamente em alguns instantes." }, { status: 502 });
  }
}
