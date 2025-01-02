import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { HiMenuAlt3, HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { AiOutlineTeam, AiOutlineBell } from "react-icons/ai";
import { FiMessageSquare, FiFolder } from "react-icons/fi";
import { GoProject } from "react-icons/go";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const menus = [
        { name: "dashboard", link: "/", icon: MdOutlineDashboard },
        { name: "team", link: "/teams", icon: AiOutlineTeam },
        { name: "messages", link: "/messages", icon: FiMessageSquare },
        { name: "report", link: "/report", icon: HiOutlineDocumentReport },
        { name: "File Manager", link: "/file", icon: FiFolder },
        { name: "Project", link: "/projects", icon: GoProject },
        { name: "Setting", link: "/setting", icon: RiSettings4Line },
        {
            name: "Notifications",
            link: null, // Không có link, dùng để hiển thị dropdown
            icon: AiOutlineBell,
            isNotification: true,
        },
    ];

    const [open, setOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

    useEffect(() => {
        // Fetch notifications from v1/user when the component mounts
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/v1/user/notifications");
            setNotifications(response.data.notifications); // Giả sử response trả về một danh sách thông báo
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const hasUnreadNotifications = notifications.some((n) => !n.read_status);

    const handleNotificationClick = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
    };

    const markAsRead = async (id) => {
        try {
            const response = await axios.post(`/v1/user/update-status/${id}`);
            if (response.status === 200) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map((n) =>
                        n._id === id ? { ...n, read_status: !n.read_status } : n // Đảo ngược trạng thái đọc
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update notification status:", error);
        }
    };

    const deleteNotification = async (notification_id) => {
        try {
            const response = await axios.delete(`/v1/user/delete-notification/${notification_id}`);
            if (response.status === 200) {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((n) => n._id !== notification_id)
                );
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    return (
        <div
            className={`bg-[#0e0e0e] min-h-screen ${open ? "w-72" : "w-16"
                } duration-500 text-gray-100 px-4`}
        >
            <div className="py-3 flex justify-end">
                <HiMenuAlt3
                    size={26}
                    className="cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            </div>
            <div className="mt-4 flex flex-col gap-4 relative">
                {menus?.map((menu, i) => (
                    <div key={i} className="relative">
                        <Link
                            to={menu?.link}
                            className={` ${menu?.margin && "mt-5"
                                } group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                            onClick={() => {
                                if (menu.isNotification) {
                                    handleNotificationClick();
                                }
                            }}
                        >
                            <div className="relative">
                                {React.createElement(menu?.icon, { size: "20" })}
                                {menu.isNotification && hasUnreadNotifications && (
                                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </div>
                            <h2
                                style={{
                                    transitionDelay: `${i + 3}00ms`,
                                }}
                                className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                                    }`}
                            >
                                {menu?.name}
                            </h2>
                            <h2
                                className={`${open && "hidden"
                                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                            >
                                {menu?.name}
                            </h2>
                        </Link>
                        {menu.isNotification && showNotificationDropdown && (
                            <div
                                className="absolute left-full ml-4 w-60 bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 z-10"
                                style={{
                                    top: "calc(100% - 150px)",
                                    left: "calc(100% + 10px)",
                                    maxHeight: "300px", // Chiều cao cố định
                                    overflowY: "auto", // Cho phép cuộn lên/xuống
                                }}
                            >
                                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                                <ul className="space-y-2">
                                    {notifications.map((notification) => (
                                        <li
                                            key={notification._id}
                                            className={`p-2 rounded cursor-pointer ${notification.read_status ? "bg-gray-700" : "bg-gray-600"}`}
                                            onClick={() => markAsRead(notification._id)}
                                        >
                                            {notification.notification_id ? notification.notification_id.content : "No Content"}
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification._id);
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
