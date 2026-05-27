import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

// Ensure baseURL is always HTTPS when coming from environment/config.
// Avoids browser “operation is insecure” errors caused by http redirects in a https page.
const api = axios.create({
    baseURL: apiBaseUrl.startsWith("http://")
        ? apiBaseUrl.replace(/^http:\/\//i, "https://")
        : apiBaseUrl,
    withCredentials: true,
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