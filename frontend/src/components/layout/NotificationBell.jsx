import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useState } from "react";

export function NotificationBell() {
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "notification-dropdown" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAllAsRead(); // Mark as read when dropdown is closed
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="
          relative p-3 rounded-xl
          bg-white border
          hover:bg-gray-50
          transition
        "
      >
        <Bell size={20} />

        {/* Notification badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              w-5 h-5 rounded-full
              bg-red-500 text-white
              text-xs flex items-center justify-center
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          id={id}
          className="
            absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg
            z-20 py-1
          "
        >
          <div className="px-4 py-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-start space-x-3 ${
                      !notif.read ? "font-semibold bg-gray-50" : ""
                    }`}
                  >
                    <div className="shrink-0">
                      {/* Icon based on type */}
                      <div
                        className={`h-3 w-3 rounded-full ${notif.type === "success"
                          ? "bg-green-500"
                          : notif.type === "error"
                          ? "bg-red-500"
                          : notif.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={handleClose}
              className="text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}