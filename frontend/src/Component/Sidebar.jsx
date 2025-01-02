import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineTeam, AiOutlineBell } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const menus = [
        { name: "dashboard", link: "/", icon: MdOutlineDashboard },
        { name: "team", link: "/teams", icon: AiOutlineTeam },
        { name: "messages", link: "/messages", icon: FiMessageSquare },
    ];

    const [open, setOpen] = useState(true);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New message from John", read: false },
        { id: 2, text: "Project deadline extended", read: false },
        { id: 3, text: "Team meeting at 3 PM", read: true },
    ]);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

    // Kiểm tra xem có thông báo chưa đọc không
    const hasUnreadNotifications = notifications.some((n) => !n.read);

    const handleNotificationClick = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
    };

    const markAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    return (
        <div
            className={`bg-[#0e0e0e] min-h-screen ${open ? "w-72" : "w-16"} duration-500 text-gray-100 px-4`}
        >
            <div className="py-3 flex justify-end">
                <HiMenuAlt3
                    size={26}
                    className="cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            </div>
            <div className="mt-4 flex flex-col gap-4 relative">
                {menus.map((menu, i) => (
                    <Link
                        to={menu?.link}
                        key={i}
                        className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                    >
                        <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                        <h2
                            className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}
                        >
                            {menu.name}
                        </h2>
                    </Link>
                ))}

                {/* Notification Icon */}
                <div className="mt-auto relative">
                    <div
                        className="flex items-center justify-center p-2 cursor-pointer relative hover:bg-gray-800 rounded-md"
                        onClick={handleNotificationClick}
                    >
                        <AiOutlineBell size={24} />
                        {hasUnreadNotifications && (
                            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                    </div>
                    {showNotificationDropdown && (
                        <div
                            className="absolute top-0 left-full ml-6 w-60 bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 z-10"
                        >
                            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                            <ul className="space-y-2">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`p-2 rounded cursor-pointer ${notification.read ? "bg-gray-700" : "bg-gray-600"}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        {notification.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
