import { Bell } from "lucide-react";

export function NotificationBell() {
    return (
        <button
            className="
                relative p-3 rounded-xl
                bg-white border
                hover:bg-gray-50
                transition
            "
        >
            <Bell size={20} />

            <span
                className="
                    absolute -top-1 -right-1
                    w-5 h-5 rounded-full
                    bg-red-500 text-white
                    text-xs flex items-center justify-center
                "
            >
                3
            </span>
        </button>
    );
}