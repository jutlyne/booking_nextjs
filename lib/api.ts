const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: auth ? 'include' : 'omit',
    cache: 'no-store',
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
