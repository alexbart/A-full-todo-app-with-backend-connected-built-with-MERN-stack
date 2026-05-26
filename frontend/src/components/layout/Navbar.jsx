import { NotificationBell } from "./NotificationBell";
import { useNavigate } from "react-router-dom";

export function Navbar({ user, search, setSearch }) {

    const navigate = useNavigate();

    const getImageUrl = (path) => {
        if (!path) return "/default-avatar.png";

        if (path.startsWith("http")) {
            return path;
        }

        return `http://localhost:5000${path}`;
    };

    return (
        <header
            className="
                h-20 bg-white border-b
                px-6 flex items-center justify-between
            "
        >

            {/* LEFT */}
            <div>
                <h1 className="text-2xl font-bold text-blue-600">
                    Todo SaaS
                </h1>
            </div>

            {/* CENTER */}
            <div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                        w-80 px-4 py-3 rounded-xl
                        border bg-gray-50
                        focus:outline-none
                        focus:ring-2 focus:ring-blue-500
                    "
                />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                <NotificationBell />

                <div
                    onClick={() => navigate("/profile")}
                    className="
                        flex items-center gap-3
                        cursor-pointer hover:bg-gray-100
                        px-3 py-2 rounded-xl
                        transition
                    "
                >
                    <img
                        src={getImageUrl(user?.profileImage)}
                        className="
                            w-10 h-10 rounded-full
                            object-cover border
                        "
                    />

                    <div>
                        <p className="font-semibold text-sm">
                            {user?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            View profile
                        </p>
                    </div>
                </div>

            </div>

        </header>
    );
}