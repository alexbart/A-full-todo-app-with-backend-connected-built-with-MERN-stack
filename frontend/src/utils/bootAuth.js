import { api, setAccessToken, clearAccessToken } from "../api/client";

export const bootAuth = async () => {

    try {
        const res = await api.post("/auth/refresh");

        setAccessToken(res.data.accessToken);

    } catch (err) {

        clearAccessToken();
    }
};