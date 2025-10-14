// src/lib/api/client.ts
export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include', // 关键：让 cookie 自动附带
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    // 跳转登录页
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API Error: ${res.status} ${msg}`);
  }

  return res.json();
}
