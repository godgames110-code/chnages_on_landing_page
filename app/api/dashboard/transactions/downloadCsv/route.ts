import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/lib/backendClient";

// Proxies a request to the backend CSV download endpoint and returns the file
export async function GET(_request: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            console.error("NEXT_PUBLIC_BACKEND_URL não configurado");
            return NextResponse.json({ error: "Backend URL não configurado" }, { status: 500 });
        }

        const url = `${backendUrl.replace(/\/$/, "")}/api/transactions/download`;

        // backendClient will forward auth cookies as Authorization header when available
        const res = await backendClient(url, {}, {}, "GET");

        const resContentType = res.headers.get("content-type") || "";

        // If backend returned JSON with a file_url (old behavior), follow it
        if (resContentType.includes("application/json")) {
            const json = await res.json().catch(() => ({}));
            if (json && json.file_url) {
                // Fetch the actual file URL
                const fileRes = await backendClient(json.file_url, {}, {}, "GET");
                const fileBuffer = await fileRes.arrayBuffer().catch(() => null);
                if (!fileBuffer) {
                    const txt = await fileRes.text().catch(() => "");
                    console.error("Erro ao baixar arquivo via file_url:", fileRes.status, txt);
                    return NextResponse.json({ error: "Erro ao baixar CSV via file_url" }, { status: fileRes.status || 502 });
                }

                const contentType = fileRes.headers.get("content-type") || "text/csv";
                const contentDisposition = fileRes.headers.get("content-disposition") || 'attachment; filename="transactions.csv"';

                return new NextResponse(fileBuffer, {
                    status: fileRes.status,
                    headers: {
                        "Content-Type": contentType,
                        "Content-Disposition": contentDisposition,
                    },
                });
            }

            // if no file_url, return original JSON as error
            return NextResponse.json({ error: json || "Unexpected response" }, { status: res.status });
        }

        // Otherwise assume backend returned the CSV directly
        const arrayBuffer = await res.arrayBuffer().catch(() => null);

        if (!arrayBuffer) {
            const text = await res.text().catch(() => "");
            console.error("Erro ao baixar CSV do backend:", res.status, text);
            return NextResponse.json({ error: "Erro ao baixar CSV" }, { status: res.status || 502 });
        }

        const contentType = res.headers.get("content-type") || "text/csv";
        const contentDisposition = res.headers.get("content-disposition") || 'attachment; filename="transactions.csv"';

        return new NextResponse(arrayBuffer, {
            status: res.status,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": contentDisposition,
            },
        });
    } catch (error) {
        console.error("Erro ao conectar com backend para download CSV:", error);
        return NextResponse.json({ error: "Erro ao conectar com backend" }, { status: 502 });
    }
}

