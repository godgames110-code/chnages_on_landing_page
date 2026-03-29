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

function normalizeAppointments(data: any) {
  if (Array.isArray(data)) {
    return data.map(mapAppointment);
  }

  if (data && typeof data === "object") {
    return mapAppointment(data);
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL nao configurado");
      return NextResponse.json({ error: "Backend URL nao configurado" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${backendUrl.replace(/\/$/, "")}/api/appointments${queryString ? `?${queryString}` : ""}`;

    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(normalizeAppointments(data));
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao obter agendamentos" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL nao configurado");
      return NextResponse.json({ error: "Backend URL nao configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/appointments`;
    const body = await request.json();

    const res = await backendClient(url, body, {}, "POST");
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(normalizeAppointments(data), { status: 201 });
    }

    return NextResponse.json(
      { error: data.errors || data.message || "Erro ao criar agendamento" },
      { status: res.status || 400 }
    );
  } catch (error) {
    console.error("Erro ao conectar com backend:", error);
    return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
  }
}
