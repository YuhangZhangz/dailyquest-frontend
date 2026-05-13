import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Intercepta as requisições para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;