import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" });

// FIXED: Check both possible token names
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh") || localStorage.getItem("refresh_token");
      const res = await api.post("/auth/token/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
      return api(originalRequest);
    }
    return Promise.reject(err);
  }
);

export default api;