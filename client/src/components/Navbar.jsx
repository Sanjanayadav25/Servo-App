import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import socket from "../services/socket";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [providerProfile, setProviderProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  const fetchUnreadCount = async () => {
    try {
      if (!user) return;

      const res = await API.get("/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setNotificationCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        if (!user) return;

        const res = await API.get("/providers/my-profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setProviderProfile(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (!user) return;

    fetchProviderProfile();
    fetchUnreadCount();

    if (user.role === "provider") {
      socket.emit("joinProviderRoom", user._id);
    }

    socket.on("newBooking", () => {
      fetchUnreadCount();
    });

    return () => {
      socket.off("newBooking");
    };
  }, [user]);

  

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">🛠️ Servo</h1>

      <div className="flex items-center gap-8">
        <Link to="/" className="hover:text-blue-400  transition">
          Home
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-400  transition">
              Login
            </Link>

            <Link to="/register" className="hover:text-blue-400 transition">
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "provider" && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400   transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/provider-bookings"
                  className="hover:text-blue-400 transition"
                >
                  Bookings
                </Link>
              </>
            )}

            {user.role === "customer" && (
              <>
                <Link
                  to="/providers"
                  className="hover:text-blue-400  transition"
                >
                  Providers
                </Link>

                <Link
                  to="/my-bookings"
                  className="hover:text-blue-400  transition"
                >
                  My Bookings
                </Link>
              </>
            )}

            {user?.role === "provider" &&
              (providerProfile ? (
                <Link
                  to="/edit-provider-profile"
                  className="hover:text-blue-400   transition"
                >
                  Edit Profile
                </Link>
              ) : (
                <Link
                  to="/complete-provider-profile"
                  className="hover:text-blue-400  transition"
                >
                  Complete Profile
                </Link>
              ))}

            <Link
              to="/notifications"
              className="hover:text-blue-400 transition  relative"
            >
              🔔 Notifications
              {notificationCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notificationCount}
                </span>
              )}
            </Link>

            <span className="text-slate-300 ">Hi, {user.name}</span>

            <button
              onClick={logoutHandler}
              className="hover:text-red-400  p-2 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
