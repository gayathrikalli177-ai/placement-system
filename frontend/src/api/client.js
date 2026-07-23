import axios from "axios";
import { clearSession, getAccessToken } from "../auth/session";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    timeout: 15000
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearSession("student");
            clearSession("company");
        }
        return Promise.reject(error);
    }
);

export default api;
