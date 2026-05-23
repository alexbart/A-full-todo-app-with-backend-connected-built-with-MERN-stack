import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { api, setAccessToken } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const bootAuth = async () => {
        try {
            const res = await api.post("/auth/refresh");

            setAccessToken(res.data.accessToken);

            const me = await getMe();
            setUser(me.data);

        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bootAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);