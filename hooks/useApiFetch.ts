import { apiFetch } from '@/lib/api/client';
import { useAuth } from '@clerk/clerk-expo';

export function useApiFetch() {
  const { getToken } = useAuth();
  return async function<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken();
    return apiFetch<T>(path, token, init);
  };
}
