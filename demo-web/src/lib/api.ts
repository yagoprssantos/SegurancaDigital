export function apiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  return url && url.trim().length > 0 ? url.replace(/\/$/, "") : "http://localhost:8080";
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}
