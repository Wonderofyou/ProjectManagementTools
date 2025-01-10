import { useEffect, useState } from "react";
import axios from "axios";
import { BellIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/outline"; // Sử dụng Heroicons outline
import { UserAddIcon } from "@heroicons/react/solid"; // Sử dụng Heroicons solid cho UserAddIcon

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Lấy thông báo từ API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/v1/user/notifications");
      const sortedNotifications = response.data.notifications.sort((a, b) =>
        new Date(b.notification_id.created_at) - new Date(a.notification_id.created_at) // Sắp xếp theo thời gian giảm dần
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Xóa thông báo
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

  // Đánh dấu thông báo là đã đọc
  const markAsRead = async (id) => {
    try {
      const response = await axios.post(`/v1/user/update-status/${id}`);
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n._id === id ? { ...n, read_status: !n.read_status } : n
          )
        );
      }
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Your Notifications</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 col-span-3">
            You don't have any notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${
                notification.read_status ? "bg-gray-200" : "bg-blue-100"
              }`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <BellIcon className="h-5 w-5 text-gray-600" />
                  <div className="font-semibold text-gray-800">
                    {/* Hiển thị nội dung thông báo */}
                    {notification.notification_id
                      ? notification.notification_id.title
                      : "No Content"}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {/* Hiển thị ngày tháng tạo thông báo */}
                  {new Date(notification.notification_id.created_at).toLocaleString()}
                </div>
              </div>

              {notification.notification_id && (
                <div className="mt-2 text-gray-700 italic">
                  You are invited to project{" "}
                  <strong>{notification.notification_id.content || "No project name"}</strong>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                >
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
                {notification.read_status ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-sm text-blue-600">New</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
