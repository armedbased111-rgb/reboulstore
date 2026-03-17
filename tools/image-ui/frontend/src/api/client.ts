const BASE = '/api'

export const api = {
  get: (path: string) => fetch(`${BASE}${path}`).then(r => r.json()),
  post: (path: string, body?: unknown) => fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json()),
  put: (path: string, body: unknown) => fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  delete: (path: string) => fetch(`${BASE}${path}`, { method: 'DELETE' }).then(r => r.json()),
}
