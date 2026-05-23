import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../api/client";

export  function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.data);
            } catch (err) {
                console.log(err);

                // token expired or invalid
                setAccessToken(null);
                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    My Profile
                </h1>

                <div className="space-y-4">
                    <div>
                        <p className="text-gray-500 text-sm">Name</p>
                        <p className="text-lg font-semibold">{user.name}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">User ID</p>
                        <p className="text-xs break-all">{user._id}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
                >
                    Back to Dashboard
                </button>

            </div>
        </div>
    );
}