import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    LayoutDashboard,
    CheckSquare,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react";
import { clearAccessToken } from "../api/client";

export function AppLayout({ children, user }) {

    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const menuItems = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            path: "/dashboard"
        },
        {
            label: "Tasks",
            icon: <CheckSquare size={20} />,
            path: "/tasks"
        },
        {
            label: "Profile",
            icon: <User size={20} />,
            path: "/profile"
        },
        {
            label: "Settings",
            icon: <Settings size={20} />,
            path: "/settings"
        }
    ];

    const handleLogout = () => {
        clearAccessToken();
        navigate("/login");
    }

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* SIDEBAR */}
            <aside
                className={`
                    bg-white border-r shadow-sm
                    transition-all duration-300 ease-in-out
                    ${collapsed ? "w-20" : "w-64"}
                `}
            >

                {/* LOGO */}
                <div className="h-16 flex items-center justify-between px-4 border-b">

                    {!collapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-blue-600">
                                Todo SaaS
                            </h1>

                            <p className="text-xs text-gray-400">
                                Productivity Platform
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="
                            p-2 rounded-lg
                            hover:bg-gray-100
                            transition
                        "
                    >
                        {collapsed
                            ? <ChevronRight size={18} />
                            : <ChevronLeft size={18} />
                        }
                    </button>

                </div>

                {/* NAVIGATION */}
                <nav className="p-3 flex flex-col gap-2">

                    {menuItems.map((item) => {

                        const active = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`
                                    flex items-center gap-3
                                    px-3 py-3 rounded-xl
                                    transition-all duration-200
                                    group

                                    ${active
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    }
                                `}
                            >

                                {/* ICON */}
                                <div className={`
                                    transition-transform duration-200
                                    group-hover:scale-110
                                `}>
                                    {item.icon}
                                </div>

                                {/* LABEL */}
                                {!collapsed && (
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                )}

                            </button>
                        );
                    })}

                </nav>
                <button
                    onClick={handleLogout}
                    className="
                    mt-auto
                    flex items-center gap-3
                    px-4 py-3
                    rounded-xl
                    text-red-500
                    hover:bg-red-50
                    transition-all
                    w-full
                    "
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>

            </aside>

            {/* MAIN AREA */}
            <main className="flex-1 p-8">
                <div className="flex flex flex-col">

                    {/* TOP NAVBAR */}
                    <header
                        className="
                        h-16 bg-white border-b
                        flex items-center justify-between
                        px-6
                    "
                    >

                        {/* LEFT */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Welcome back 👋
                            </h2>

                            <p className="text-sm text-gray-500">
                                Manage your productivity
                            </p>
                        </div>

                        {/* RIGHT USER */}
                        <div
                            onClick={() => navigate("/profile")}
                            className="
                            flex items-center gap-3
                            cursor-pointer
                            hover:bg-gray-100
                            px-3 py-2 rounded-xl
                            transition
                        "
                        >

                            <img
                                src={
                                    user?.profileImage
                                        ? `http://localhost:5000${user.profileImage}`
                                        : "/default-avatar.png"
                                }
                                alt="Profile"
                                className="
                                w-10 h-10
                                rounded-full
                                object-cover
                                border
                            "
                            />

                            <div className="text-right">
                                <p className="font-semibold text-sm">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    View Profile
                                </p>
                            </div>

                        </div>

                    </header>

                    {/* PAGE CONTENT */}
                    <div className="p-6">
                        {children}
                    </div>

                    <footer
                        className="
                        mt-10
                        border-t
                        pt-6
                        text-sm
                        text-gray-500
                        flex justify-between items-center
                        "
                    >
                        <p>
                            © 2026 Todo SaaS. All rights reserved.
                        </p>

                        <div className="flex gap-4">
                            <button className="hover:text-gray-700">
                                Privacy
                            </button>

                            <button className="hover:text-gray-700">
                                Terms
                            </button>

                            <button className="hover:text-gray-700">
                                Support
                            </button>
                        </div>
                    </footer>
                </div>
            </main>

        </div>
    );
}