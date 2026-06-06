import { useEffect, useState, useRef } from "react";
import API from "../services/api";


function ProviderBookingsPage() {
  const [bookings, setBookings] = useState([]);
  
  

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await API.get("/bookings/provider-bookings", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const joinProviderRoom = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await API.get("/providers/my-profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      socket.emit("joinProviderRoom", res.data._id);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.put(
        `/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Provider Bookings
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-slate-800 p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              {booking.customer.name}
            </h3>

            <p className="text-slate-300 mb-2">
              Email: {booking.customer.email}
            </p>

            <p className="text-slate-300 mb-2">
              Service Date: {new Date(booking.serviceDate).toLocaleDateString()}
            </p>

            <p className="text-slate-300 mb-2">Address: {booking.address}</p>

            <p className="text-slate-300 mb-2">
              Problem: {booking.problemDescription}
            </p>

            <p className="text-yellow-400 font-semibold mb-4">
              Status: {booking.status}
            </p>

            {booking.status === "pending" && (
              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus(booking._id, "accepted")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(booking._id, "cancelled")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {booking.status === "accepted" && (
              <button
                onClick={() => updateStatus(booking._id, "completed")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

      
    </div>
  );
}

export default ProviderBookingsPage;
