import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, uploadProfile } from "../api/auth";

export function Profile() {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                setUser(data);
            } catch (err) {
                console.log(err);
                if (err?.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);

        try {
            const updatedUser = await uploadProfile(file);
            setUser(updatedUser); // instant UI update
            setFile(null);
        } catch (err) {
            console.log("Upload error:", err.response?.data || err.message);
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
                                ? `${user.profileImage}?t=${Date.now()}`
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