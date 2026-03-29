import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Array de rotas protegidas
const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // middleware: minimal diagnostics removed for production

  if (path === "/api/auth/me") {
    // Permitir a passagem para a rota /api/auth/me sem redirecionamento
  // allow /api/auth/me
    return NextResponse.next();
  }

  // Verifica se a rota atual começa com alguma rota protegida
  const isProtected = protectedRoutes.some(route => path.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Tenta validar o token chamando a rota interna /api/auth/me
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const origin = new URL(req.url).origin;

  try {
    const response = await fetch(`${origin}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log(`[app/middleware] erro ao validar token:`, err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
