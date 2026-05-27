import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true, // important later for refresh-token cookies
});

// hydrate token from storage
let accessToken = localStorage.getItem("accessToken");

// set token
export const setAccessToken = (token) => {
    if (!token || token === "undefined") return;

    accessToken = token;
    localStorage.setItem("accessToken", token);
};

// get token
export const getAccessToken = () => {
    return accessToken || localStorage.getItem("accessToken");
};

// clear token
export const clearAccessToken = () => {
    accessToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
};

// attach token automatically
api.interceptors.request.use((config) => {
    const token = accessToken || localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});