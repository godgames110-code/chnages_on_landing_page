import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

function mapAppointment(appointment: any) {
  if (!appointment || typeof appointment !== "object") {
    return appointment;
  }

  return {
    id: String(appointment.id ?? ""),
    clientId: String(appointment.client_id ?? appointment.clientId ?? ""),
    clientName: appointment.client_name ?? appointment.clientName ?? "Cliente",
    date: appointment.date ?? "",
    time: appointment.time ?? "",
    address: appointment.address ?? "",
    description: appointment.description ?? "",
    status: appointment.status ?? "scheduled",
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL nao configurado");
      return NextResponse.json({ error: "Backend URL nao configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/appointments/${id}`;
    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(mapAppointment(data));
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter agendamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL nao configurado");
      return NextResponse.json({ error: "Backend URL nao configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/appointments/${id}`;
    const body = await request.json();

    const res = await backendClient(url, body, {}, "PUT");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(mapAppointment(data));
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao atualizar agendamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL nao configurado");
      return NextResponse.json({ error: "Backend URL nao configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/appointments/${id}`;
    const res = await backendClient(url, {}, {}, "DELETE");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao deletar agendamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
