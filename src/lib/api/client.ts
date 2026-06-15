import { API_BASE_URL } from '$lib/config';

export class ApiError extends Error {
  status: number;
  validationErrors?: Record<string, string[]>;

  constructor(message: string, status: number, validationErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  let message = `Fejl (${res.status})`;
  let validationErrors: Record<string, string[]> | undefined;

  try {
    const body = await res.json();
    if (body.error) {
      message = body.error;
    } else if (body.errors) {
      validationErrors = body.errors;
      message = 'Validering fejlede.';
    } else if (body.title) {
      message = body.title;
    }
  } catch {
  }

  throw new ApiError(message, res.status, validationErrors);
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  fetchFn?: typeof fetch;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, fetchFn = fetch } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetchFn(`${API_BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse<T>(res);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Serveren svarer ikke. Tjek din forbindelse.', 0);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(path: string, fetchFn?: typeof fetch) =>
    apiRequest<T>(path, { method: 'GET', fetchFn }),
  post: <T>(path: string, body: unknown, fetchFn?: typeof fetch) =>
    apiRequest<T>(path, { method: 'POST', body, fetchFn }),
  put: <T>(path: string, body: unknown, fetchFn?: typeof fetch) =>
    apiRequest<T>(path, { method: 'PUT', body, fetchFn }),
  delete: <T>(path: string, fetchFn?: typeof fetch) =>
    apiRequest<T>(path, { method: 'DELETE', fetchFn })
};