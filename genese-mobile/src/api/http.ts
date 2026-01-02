import { getApiBaseUrl } from "../config/env";

export type ApiError = {
  code?: string;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export type Tokens = { accessToken: string; refreshToken: string };

export type AuthAccessors = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (t: Tokens) => Promise<void> | void;
  clearSession: () => Promise<void> | void;
};

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function makeHttp(access: AuthAccessors) {
  const baseUrl = getApiBaseUrl();

  async function rawRequest<T>(path: string, init: RequestInit, token?: string): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(init.headers as Record<string, string>),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    // If body is provided and no content-type set, assume JSON
    if (init.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

    const res = await fetch(`${baseUrl}${path}`, { ...init, headers });

    const payload = await parseJsonSafe(res);

    // Backend uses {success, data|error}. If it's already in that shape, return it.
    if (payload && typeof payload === "object" && "success" in payload) {
      return payload as ApiResponse<T>;
    }

    if (!res.ok) {
      return { success: false, error: { message: payload?.message ?? res.statusText } };
    }

    // Fallback: wrap arbitrary JSON
    return { success: true, data: payload as T };
  }

  async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = access.getAccessToken();
    const first = await rawRequest<T>(path, init, token ?? undefined);

    // If unauthorized, try refresh once
    if (!first.success && (first.error.code === "UNAUTHORIZED" || first.error.message?.toLowerCase().includes("unauthorized"))) {
      const refreshed = await refresh();
      if (!refreshed) return first;
      const retryToken = access.getAccessToken();
      return rawRequest<T>(path, init, retryToken ?? undefined);
    }

    // Some backends may respond 401 without code; detect by message only is brittle.
    // If you expose status codes in error, improve here.
    return first;
  }

  async function refresh(): Promise<boolean> {
    const refreshToken = access.getRefreshToken();
    if (!refreshToken) return false;

    const res = await rawRequest<{ accessToken: string; refreshToken: string }>(
      "/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken }) }
    );

    if (res.success) {
      await access.setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
      return true;
    }

    await access.clearSession();
    return false;
  }

  return { request };
}
