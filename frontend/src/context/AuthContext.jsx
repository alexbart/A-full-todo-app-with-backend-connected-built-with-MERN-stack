import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as logoutApi } from "../api/auth";
import { clearAccessToken, setAccessToken } from "../api/client";
import { api } from "../api/client";

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

        } catch {
            setUser(null);
            clearAccessToken();
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch {
            // Even if the network fails, clear local state so user is logged out in the UI.
        } finally {
            clearAccessToken();
            setUser(null);
        }
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (cancelled) return;
            await bootAuth();
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);