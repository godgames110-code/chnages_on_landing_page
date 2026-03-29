import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/pmoc-foz-do-iguacu",
  "/instalacao-ar-condicionado-foz-do-iguacu",
  "/manutencao-ar-condicionado-foz-do-iguacu",
  "/limpeza-ar-condicionado-foz-do-iguacu"
]);

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.has(pathname)) return true;

  return Array.from(publicRoutes).some(route =>
    route !== "/" && pathname.startsWith(route + "/")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  // bloqueia auth pages para usuário logado
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
