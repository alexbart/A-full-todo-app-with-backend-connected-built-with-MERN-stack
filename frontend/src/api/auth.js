import { api } from "./client";

export const getMe = () => api.get("/auth/me");

export const login = (credentials) => api.post("/auth/login", credentials);

export const register = (userData) => api.post("/auth/register", userData);

export const refreshToken = () => api.post("/auth/refresh");

export const uploadProfile = (formData) => api.post("/auth/upload-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});