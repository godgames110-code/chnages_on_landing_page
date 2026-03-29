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
  { params }: { params: Promise<{ month: string; year: string }> }
) {
  try {
    const { month, year } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL nao configurado");
      return NextResponse.json({ error: "Backend URL nao configurado" }, { status: 500 });
    }

    const url = `${backendUrl.replace(/\/$/, "")}/api/appointments/calendar/${month}/${year}`;
    const res = await backendClient(url, {}, {}, "GET");
    const data = await res.json().catch(() => ([]));

    if (res.ok) {
      const normalized = Array.isArray(data) ? data.map(mapAppointment) : [];
      return NextResponse.json(normalized);
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
