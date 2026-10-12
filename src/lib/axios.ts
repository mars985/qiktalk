import axios from "axios";

if (import.meta.env.DEV)
  axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const apiPrefix = "/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + apiPrefix,
  withCredentials: true,
});

export default api;
