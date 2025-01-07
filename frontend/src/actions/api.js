import axios from "axios";

const backend_url = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: backend_url,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true
  },
});

export const axiosFormdataInstance = axios.create({
  baseURL: backend_url,
  headers: {
    "Content-Type": "multipart/form-data",
    "ngrok-skip-browser-warning": true,
  },
});

export default axiosInstance;
