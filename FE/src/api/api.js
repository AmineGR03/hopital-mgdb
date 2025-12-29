import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ backend port
});

// Add request interceptor to always include the latest token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
