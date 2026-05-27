import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { register as registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { user, loading } = useAuth();

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

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await registerUser({ name, email, password });

            navigate("/login");

        } catch (error) {
            console.log("Register error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleRegister} className="p-6 bg-white shadow rounded">

                <h2 className="text-xl mb-4">Register</h2>

                <input
                    placeholder="Name"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    placeholder="Email"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-green-600 text-white px-4 py-2 w-full">
                    Register
                </button>

            </form>
        </div>
    );
}