import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAccessToken = () => {
    accessToken = null;
    delete api.defaults.headers.common["Authorization"];
};

export const getAccessToken = () => accessToken;

export { api };