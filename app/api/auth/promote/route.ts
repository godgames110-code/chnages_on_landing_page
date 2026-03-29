import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

/**
 * POST /api/auth/promote - Promove usuário para técnico
 */
export async function POST(request: NextRequest) {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:9000";
    const body = await request.json();

    console.debug(`[api/auth/promote] POST ${backend}/api/promote`);
    const response = await backendClient(`${backend}/api/promote`, body, {}, "POST");

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error || "Erro ao promover usuário" }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com backend" }, 
      { status: 502 }
    );
  }
}
