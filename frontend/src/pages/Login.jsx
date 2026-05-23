import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, setToken } from "../../../src/utils/auth";
import axios from "axios";
import { login as loginUser } from "../api/auth";


export function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            setToken(data.token);

            localStorage.setItem("user", JSON.stringify(data.user));


            navigate("/dashboard");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded">

                <h2 className="text-xl mb-4">Login</h2>

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

                <button className="bg-blue-600 text-white px-4 py-2 w-full">
                    Login
                </button>

            </form>
        </div>
    );
}