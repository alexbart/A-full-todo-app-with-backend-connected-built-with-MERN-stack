import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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