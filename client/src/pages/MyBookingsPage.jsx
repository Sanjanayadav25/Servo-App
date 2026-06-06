import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    socket.emit("joinUserRoom", userInfo._id);

    socket.on("callAccepted", () => {
      alert("Provider accepted your call");
    });

    socket.on("callDeclined", () => {
      alert("Provider declined your call");
    });

    return () => {
      socket.off("callAccepted");
      socket.off("callDeclined");
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await API.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
     
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCall = (booking) => {
      console.log("Calling provider room:", booking.provider._id);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    socket.emit("callProvider", {
      providerId: booking.provider._id,
      customerId: userInfo._id,
      customerName: userInfo.name,
    });

    alert("Calling provider...");
  };

  return (
    <div className="bg-slate-950 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center text-slate-400 text-lg">
          No bookings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {booking.provider.profession}
              </h3>

              <p className="text-slate-300 mb-3">
                <span className="text-blue-400 font-semibold">
                  Service Date:
                </span>{" "}
                {new Date(booking.serviceDate).toLocaleDateString()}
              </p>

              <p className="text-slate-300 mb-3">
                <span className="text-blue-400 font-semibold">Status:</span>{" "}
                <span
                  className={
                    booking.status === "pending"
                      ? "text-yellow-400"
                      : booking.status === "accepted"
                        ? "text-blue-400"
                        : booking.status === "completed"
                          ? "text-green-400"
                          : "text-red-400"
                  }
                >
                  {booking.status}
                </span>
              </p>

              {booking.status === "accepted" && (
                <button
                  onClick={() => handleCall(booking)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  📞 Call Provider
                </button>
              )}

              <div className="mt-4 border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400">
                  Booking ID: {booking._id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default MyBookingsPage;
