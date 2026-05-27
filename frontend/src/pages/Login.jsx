import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginUser } from "../api/auth";
import { setAccessToken } from "../api/client";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser({ email, password });

            setAccessToken(res.data.accessToken);

            navigate("/dashboard");

        } catch (error) {
            console.log("Login error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded w-80">

                <h2 className="text-xl mb-4 text-center">Login</h2>

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