import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7777",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");

        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error, try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
