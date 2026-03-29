import { NextRequest, NextResponse } from "next/server";
import { backendClientFormData } from "@/lib/backendClient";

export async function POST(req: NextRequest) {
  // Extrair form-data
  const formData = await req.formData();
  const file = formData.get("file") || formData.get("logo") || formData.get("photo") || formData.get("proof_photo");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  // Extrair outros campos
  const fieldName = formData.has("logo") ? "logo" : formData.has("photo") ? "photo" : formData.has("proof_photo") ? "proof_photo" : "file";
  const endpoint = formData.get("endpoint") || `/api/me/upload-logo`;

  // Montar FormData para backend
  const backendForm = new FormData();
  backendForm.append(fieldName, file);

  // Repassar para o backend usando backendClientFormData
  const backendRes = await backendClientFormData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
    backendForm,
    {},
    "POST"
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
