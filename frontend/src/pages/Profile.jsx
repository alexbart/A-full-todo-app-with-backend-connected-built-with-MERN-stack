import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, uploadProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function Profile() {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const { setUser: setAuthUser } = useAuth();

    const navigate = useNavigate();
    const cacheBuster = useMemo(() => Date.now(), []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                setUser(res.data);
                setAuthUser(res.data);
            } catch {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        try {
            const res = await uploadProfile(file);
            setUser(res.data);
            setAuthUser(res.data);
            setFile(null);
        } catch {
            // Upload error handled silently
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={
                            preview ||
                            (user?.profileImage
                                ? `${user.profileImage}?t=${cacheBuster}`
                                : "/default-avatar.png")
                        }
                        className="w-24 h-24 rounded-full border object-cover"
                    />

                    <p className="mt-2 font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                {/* Upload */}
                <div className="space-y-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setFile(file);
                            setPreview(URL.createObjectURL(file));
                        }}
                    />

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload Photo"}
                    </button>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
                >
                    Back
                </button>

            </div>
        </div>
    );
}