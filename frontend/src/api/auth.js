import { api } from "./client";

export const getMe = () => api.get("/auth/me");

export const login = (credentials) => api.post("/auth/login", credentials);

export const register = (userData) => api.post("/auth/register", userData);

export const refreshToken = () => api.post("/auth/refresh");

export const logout = () => api.post("/auth/logout");

export const verifyEmail = (token) => api.post("/auth/verify-email", { token });

export const resendVerification = (email) =>
    api.post("/auth/resend-verification", { email });

export const uploadProfile = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/auth/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};