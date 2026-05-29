import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5245/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const ok = await useAuthStore.getState().refresh();

      if (ok) {
        const newToken = useAuthStore.getState().accessToken;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } else {
        await useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.detail ||
      error.response?.data?.title ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default api;