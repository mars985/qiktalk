// axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // adjust if needed
  withCredentials: true, // allows sending cookies (if auth uses them)
});

export default api;
