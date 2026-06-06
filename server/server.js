const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Service Marketplace API is running 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Provider room
  socket.on("joinProviderRoom", (providerId) => {
    socket.join(providerId);

    console.log(`Provider joined room ${providerId}`);
  });

  // User room (customer)
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`User joined room ${userId}`);
  });

  // Customer calls provider
  socket.on("callProvider", (data) => {
    io.to(data.providerId).emit("incomingCall", {
      customerId: data.customerId,
      customerName: data.customerName,
    });
  });

  // Provider accepts
  socket.on("acceptCall", (data) => {
    io.to(data.customerId).emit("callAccepted");
  });

  // Provider declines
  socket.on("declineCall", (data) => {
    io.to(data.customerId).emit("callDeclined");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
