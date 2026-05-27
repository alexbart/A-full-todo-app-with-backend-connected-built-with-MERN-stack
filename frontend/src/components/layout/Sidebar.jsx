import {
    LayoutDashboard,
    CheckSquare,
    User,
    Settings,
    LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const navClass = ({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200
        ${isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-100"}
    `;

    return (
        <aside
            className="
                w-72 bg-white border-r
                min-h-screen p-5
                flex flex-col
            "
        >

            {/* LOGO */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-blue-600">
                    TaskFlow
                </h1>

                <p className="text-sm text-gray-500">
                    Productivity SaaS
                </p>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col gap-2">

                <NavLink
                    to="/dashboard"
                    className={navClass}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={navClass}
                >
                    <CheckSquare size={20} />
                    Tasks
                </NavLink>

                <NavLink
                    to="/profile"
                    className={navClass}
                >
                    <User size={20} />
                    Profile
                </NavLink>

                <NavLink
                    to="/settings"
                    className={navClass}
                >
                    <Settings size={20} />
                    Settings
                </NavLink>

            </nav>

            {/* BOTTOM */}
            <div className="mt-auto">

                <button
                    onClick={handleLogout}
                    className="
                        w-full flex items-center gap-3
                        px-4 py-3 rounded-xl
                        text-red-500
                        hover:bg-red-50
                        transition
                    "
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );
}