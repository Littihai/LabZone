import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─ Types ─────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (email: string, fullName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  clearError: () => void;
}

// ─ Config ─────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5245/api";

// ─ API helper ─────────────────────────────────────────────────
async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!text) throw new Error(`Server returned empty response (status ${res.status})`);

  let data: unknown;
  try { data = JSON.parse(text); }
  catch { throw new Error(`Invalid JSON from server: ${text.substring(0, 100)}`); }

  if (!res.ok) {
    const err = data as { detail?: string; title?: string };
    throw new Error(err.detail ?? err.title ?? `Request failed (${res.status})`);
  }
  return data as T;
}

// ─ Response type ──────────────────────────────────────────────
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: User;
}

// ─ Store (with localStorage persist) ─────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiPost<AuthResponse>("/auth/login", { email, password });
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
          throw e;
        }
      },

      googleLogin: async (idToken) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiPost<AuthResponse>("/auth/google-login", { idToken });
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
          throw e;
        }
      },

      register: async (email, fullName, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiPost<AuthResponse>("/auth/register", { email, fullName, password });
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
          throw e;
        }
      },

      logout: async () => {
        const rt = get().refreshToken;
        set({ user: null, accessToken: null, refreshToken: null });
        if (rt) {
          fetch(`${BASE}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: rt }),
          }).catch(() => {});
        }
      },

      refresh: async () => {
        const rt = get().refreshToken;
        if (!rt) return false;
        try {
          const data = await apiPost<AuthResponse>("/auth/refresh", { refreshToken: rt });
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
          return true;
        } catch {
          set({ user: null, accessToken: null, refreshToken: null });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "nexauth-session",           // key ใน localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({          // เก็บเฉพาะ 3 field นี้ ไม่เก็บ isLoading/error
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// ─ Auth fetch helper ──────────────────────────────────────────
export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const { accessToken, refresh } = useAuthStore.getState();
  if (!accessToken) throw new Error("Not authenticated");

  const doRequest = (token: string) =>
    fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } });

  let response = await doRequest(accessToken);

  if (response.status === 401) {
    const ok = await refresh();
    const newToken = useAuthStore.getState().accessToken;
    if (ok && newToken) {
      response = await doRequest(newToken);
    } else {
      throw new Error("Session expired — please login again");
    }
  }

  return response;
}