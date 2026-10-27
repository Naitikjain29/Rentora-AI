
import Axios from "axios";

const api = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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

export const imageUrl = (filename) => {
  if (!filename) return "";

  // Support full URLs
  if (/^https?:\/\//i.test(filename)) {
    return filename;
  }

  const baseURL = api.defaults.baseURL?.replace(/\/+$/, "");

  if (!baseURL) return filename;

  // Support both filename.jpg and /uploads/filename.jpg
  const cleanPath = filename.startsWith("/uploads/")
    ? filename
    : `/uploads/${filename.replace(/^\/+/, "")}`;

  return `${baseURL}${cleanPath}`;
};

export default api;
