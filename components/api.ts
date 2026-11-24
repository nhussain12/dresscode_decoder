// Tiny fetch helper for our two API routes.
// Throws if the network fails or the route answers with a non-200 status
// (the routes send `{ error: string }` in that case).
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data === null) {
    const message = data && typeof data.error === "string" ? data.error : `request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}
