const BASE_URL = 'https://inventory-manager-backend-zd9h.onrender.com';

export async function apiFetch<T>(path: string, token?: string | null, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    const error = new Error(body.message ?? res.statusText);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  return res.json() as Promise<T>;
}
