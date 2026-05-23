import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../src/utils/auth";
import { register as registerUser } from "../api/auth";



export function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // 🔐 redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        const data = await registerUser(name, email, password);

        navigate("/login");
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