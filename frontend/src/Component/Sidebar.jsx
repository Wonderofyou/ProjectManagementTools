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
            link: "/notifications", // Không có link, dùng để hiển thị dropdown
            icon: AiOutlineBell,
        },
    ];

    const [open, setOpen] = useState(true);



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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
