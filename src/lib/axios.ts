import axios from "axios";

if (import.meta.env.DEV)
  axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default api;
