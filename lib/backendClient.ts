// lib/backendClient.ts
import { cookies } from "next/headers";

/**
 * Cliente para comunicação com o backend PHP.
 * Lê o token do cookie e adiciona no header Authorization.
 */
export async function backendClient(
  targetUrl: string,
  bodyObj: Record<string, unknown> = {},
  extraHeaders: Record<string, string> = {},
  method: string = "POST"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  };

  // Se tiver token, manda automaticamente no Authorization header
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include', // Envia cookies automaticamente (fallback)
  };

  // Only attach a JSON body for methods that commonly include one.
  const methodUpper = method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(methodUpper)) {
    options.body = JSON.stringify(bodyObj);
  }

  const start = Date.now();
  const res = await fetch(targetUrl, options);
  const duration = Date.now() - start;

  // Log sanitizado (remove senhas)
  try {
    const clone = res.clone();
    const bodyText = await clone.text();
    const sanitized = bodyText.replace(/"password"\s*:\s*".*?"/gi, '"password":"<redacted>"');
    console.debug(`[backendClient] ${method} ${targetUrl} - ${res.status} (${duration}ms)`);
  } catch (e) {
    // Ignore body read errors
  }

  return res;
}

export async function backendClientFormData(
  targetUrl: string,
  formData: FormData,
  extraHeaders: Record<string, string> = {},
  method: string = "POST"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
    body: formData,
  };

  const start = Date.now();
  const res = await fetch(targetUrl, options);
  const duration = Date.now() - start;

  try {
    const clone = res.clone();
    const bodyText = await clone.text();
    console.debug(`[backendClientFormData] ${method} ${targetUrl} - ${res.status} (${duration}ms)`);
  } catch (e) {}

  return res;
}
