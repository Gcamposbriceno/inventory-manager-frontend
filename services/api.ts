import { API_BASE_URL, handleApiResponse, logApiCall } from "@/config/api";

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export const getPublicRecipes = async (token?: string | null) => {
  logApiCall('/recipes/public', 'GET');

  const response = await apiFetch(
    `${API_BASE_URL}/recipes/public`,
    {},
    token
  );

  const data = await handleApiResponse(response);
  return data.data;
};