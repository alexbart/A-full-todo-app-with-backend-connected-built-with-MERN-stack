import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login as loginUser } from "../api/auth";
import { setAccessToken } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { user, loading, setUser } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [loading, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginUser({ email, password });

            setAccessToken(res.data.accessToken);
            setUser(res.data.user);

            navigate("/dashboard", { replace: true });

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setError(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded w-80">

                <h2 className="text-xl mb-4 text-center">Login</h2>
                {error && (
                    <p className="text-sm text-red-600 mb-3">
                        {error}
                    </p>
                )}

                <input
                    placeholder="Email"
                    className="border p-2 w-full mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="border p-2 w-full mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-blue-600 text-white px-4 py-2 w-full">
                    Login
                </button>

            </form>
        </div>
    );
}