import { useEffect, useState } from "react";
import API from "../services/api";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await API.get(
        "/notifications/my-notifications",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="text-center text-slate-400 text-xl">
          No Notifications Yet
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-slate-800 p-5 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>

                <div>
                  <p className="text-white text-lg">
                    {notification.message}
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;