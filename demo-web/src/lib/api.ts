export function apiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  return url && url.trim().length > 0 ? url.replace(/\/$/, "") : "http://localhost:8080";
}

type ApiErrorPayload = {
  message?: string;
  error?: string;
  status?: number;
};

async function readErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const data = (await res.json()) as ApiErrorPayload;
      if (data?.message && String(data.message).trim().length > 0) return String(data.message);
      if (data?.error && String(data.error).trim().length > 0) return String(data.error);
    } catch {
      // fall through
    }
  }

  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao backend. Verifique se ele está rodando e se a URL está correta (CORS/porta).",
    );
  }

  if (!res.ok) {
    const msg = await readErrorMessage(res);
    throw new Error(msg);
  }

  return (await res.json()) as T;
}
