import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

/**
 * GET /api/auth/me - Obter informações do usuário logado
 */
export async function GET(request: NextRequest) {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:9000";
    const response = await backendClient(`${backend}/api/me`, {}, {}, "GET");

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || "Unauthorized" }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com backend" }, 
      { status: 502 }
    );
  }
}

/**
 * PUT /api/auth/me - Atualizar informações do usuário
 */
export async function PUT(request: NextRequest) {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:9000";
    const body = await request.json();

    const response = await backendClient(`${backend}/api/me`, body, {}, "PUT");

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || "Erro ao atualizar perfil" }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com backend" }, 
      { status: 502 }
    );
  }
}