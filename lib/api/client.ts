const BASE_URL = 'http://localhost:8000';

export async function apiFetch<T>(
  path: string,
  token?: string | null,
  init?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      message?: string;
      detail?: string | { msg: string }[];
    };
    const detail = Array.isArray(body.detail)
      ? body.detail.map((d) => d.msg).join(', ')
      : body.detail;
    const error = new Error(body.message ?? detail ?? res.statusText);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}
