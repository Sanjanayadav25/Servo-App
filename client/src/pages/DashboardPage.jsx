import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid , Cell } from "recharts";
import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [available, setAvailable] = useState(true);
  const COLORS = ["#facc15", "#22c55e", "#3b82f6"];

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    fetchDashboard();

    socket.emit("joinProviderRoom", userInfo._id);

    socket.on("newBooking", (data) => {
      alert(data.message);

      fetchDashboard();
    });

    return () => {
      socket.off("newBooking");
    };
  }, []);

  const fetchDashboard = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await API.get("/bookings/provider-dashboard", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setStats(res.data);
      setAvailable(res.data.available);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await API.put(
        "/providers/toggle-availability",
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setAvailable(res.data.available);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) {
    return (
      <div className="bg-slate-950 min-h-screen flex justify-center items-center">
        <h2 className="text-white text-2xl">Loading...</h2>
      </div>
    );
  }

   const chartData = stats.bookingStatusData || [];
   const earningsData = stats.monthlyEarnings || [];

  return (
    <div className="bg-slate-950 min-h-screen p-8">
      <h1 className="text-5xl font-bold text-white text-center mb-8">
        Dashboard
      </h1>

      <div className="flex justify-start mb-8">
        <button
          onClick={toggleAvailability}
          className={`px-6 py-3 rounded-lg font-semibold ${
            available ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {available ? "🟢 Available" : "🔴 Unavailable"}
        </button>
      </div>

      {/* Welcome Section */}
      <div className="bg-slate-800 rounded-xl p-6 mb-8 text-center shadow-lg">
        <h2 className="text-2xl font-semibold text-white">
          Welcome Back Provider 👋
        </h2>

        <p className="text-slate-400 mt-2">
          Here's an overview of your service activity.
        </p>
      </div>

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
          <div className="text-4xl mb-2">📅</div>

          <h3 className="text-slate-400">Total Bookings</h3>

          <p className="text-4xl font-bold text-white mt-2">
            {stats.totalBookings}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
          <div className="text-4xl mb-2">⏳</div>

          <h3 className="text-slate-400">Pending</h3>

          <p className="text-4xl font-bold text-yellow-400 mt-2">
            {stats.pendingBookings}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
          <div className="text-4xl mb-2">✅</div>

          <h3 className="text-slate-400">Accepted</h3>

          <p className="text-4xl font-bold text-green-400 mt-2">
            {stats.acceptedBookings}
          </p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
          <div className="text-4xl mb-2">✔️</div>

          <h3 className="text-slate-400">Completed</h3>

          <p className="text-4xl font-bold text-blue-400 mt-2">
            {stats.completedBookings}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
          <div className="text-4xl mb-2">⭐</div>

          <h3 className="text-slate-400">Average Rating</h3>

          <p className="text-4xl font-bold text-yellow-400 mt-2">
            {Number(stats.averageRating || 0).toFixed(1)}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
          <div className="text-4xl mb-2">💬</div>

          <h3 className="text-slate-400">Total Reviews</h3>

          <p className="text-4xl font-bold text-white mt-2">
            {stats.totalReviews}
          </p>
        </div>

         <div className="bg-slate-800 p-6 rounded-xl text-center hover:-translate-y-2 hover:shadow-lg transition duration-300">
           <div className="text-4xl mb-2">💰</div>

            <h3 className="text-slate-400"> Total Earnings</h3>

            <p className="text-4xl font-bold text-green-400 mt-2">
             ₹{stats.totalEarnings}
            </p>
         </div>

      </div>

      {/* Analytics Section */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Booking Status */}
     <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
     <h2 className="text-2xl font-bold text-white mb-4">
      Booking Status
      </h2>

      <div className="h-80">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
         data={chartData}
         dataKey="value"
         nameKey="name"
         outerRadius={100}
        label
         >
      {chartData.map((entry, index) => (
      <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
      />
      ))}
     </Pie>
          <Tooltip />
          <Legend />
         </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  {/* Monthly Earnings */}
  <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
    <h2 className="text-2xl font-bold text-white mb-4">
      Monthly Earnings
    </h2>

    <div className="h-80">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={earningsData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="earnings"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      {/* Performance Summary */}
      <div className="bg-slate-800 rounded-xl p-6 mt-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">
          Performance Summary
        </h2>

        <p className="text-slate-300 text-lg">
          You have completed{" "}
          <span className="text-blue-400 font-bold">{stats.totalBookings}</span>{" "}
          bookings and received{" "}
          <span className="text-yellow-400 font-bold">
            {stats.totalReviews}
          </span>{" "}
          reviews with an average rating of{" "}
          <span className="text-green-400 font-bold">
            {Number(stats.averageRating || 0).toFixed(1)}
          </span>
          .
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
