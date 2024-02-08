import axios from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: "https://crud-db-801e.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config:any) => {
    const token = Cookies.get("Token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  }
);

export default api;