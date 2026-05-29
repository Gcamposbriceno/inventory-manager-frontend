const BASE_URL = 'https://inventory-manager-backend-zd9h.onrender.com';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    const error = new Error(body.message ?? res.statusText);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  return res.json() as Promise<T>;
}
