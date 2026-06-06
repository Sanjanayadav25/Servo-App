const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  getProviderDashboard,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/provider-bookings", protect, getProviderBookings);
router.get("/provider-dashboard", protect, getProviderDashboard);
router.put("/:id/status", protect, updateBookingStatus);


module.exports = router;
