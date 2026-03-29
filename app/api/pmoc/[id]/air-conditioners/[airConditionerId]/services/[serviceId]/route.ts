import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ airConditionerId: string; serviceId: string }> }
) {
  try {
    const { airConditionerId, serviceId } = await context.params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }
    const url = `${backendUrl.replace(/\/$/, "")}/api/air-conditioners/${airConditionerId}/services/${serviceId}`;
    const res = await backendClient(url, undefined, {}, "GET");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: data.errors || data.message || "Erro ao buscar serviço" }, { status: res.status || 400 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ airConditionerId: string; serviceId: string }> }
) {
  try {
    const { airConditionerId, serviceId } = await context.params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }
    const url = `${backendUrl.replace(/\/$/, "")}/api/air-conditioners/${airConditionerId}/services/${serviceId}`;
    const body = await request.json();
    const res = await backendClient(url, body, {}, "PUT");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: data.errors || data.message || "Erro ao editar serviço" }, { status: res.status || 400 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ airConditionerId: string; serviceId: string }> }
) {
  try {
    const { airConditionerId, serviceId } = await context.params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
    }
    const url = `${backendUrl.replace(/\/$/, "")}/api/air-conditioners/${airConditionerId}/services/${serviceId}`;
    const res = await backendClient(url, undefined, {}, "DELETE");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: data.errors || data.message || "Erro ao deletar serviço" }, { status: res.status || 400 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}