import { api } from "./client";

// LOGIN
export const login = (email, password) =>
    api.post("/auth/login", { email, password }).then(res => res.data);

// REGISTER
export const register = (name, email, password) =>
    api.post("/auth/register", { name, email, password }).then(res => res.data);

// REFRESH TOKEN
export const refreshToken = () =>
    api.post("/auth/refresh").then(res => res.data);

// GET CURRENT USER
export const getMe = () =>
    api.get("/auth/me").then(res => res.data);

export const uploadProfile = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return api.post("/auth/upload-profile", formData)
        .then(res => res.data);
};