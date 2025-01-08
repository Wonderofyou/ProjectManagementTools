import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

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

  console.log(notifications);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

      {/* Display notifications */}
      <div className="space-y-4">
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
      </div>
    </div>
  );
}
