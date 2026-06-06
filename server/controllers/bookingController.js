const Booking = require("../models/Booking");
const Provider = require("../models/Provider");
const Notification = require("../models/Notification");

const createBooking = async (req, res) => {
  try {
    const { providerId, serviceDate, address, problemDescription } = req.body;

    // Check provider exists
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user._id,
      provider: providerId,
      serviceDate,
      address,
      problemDescription,
      amount: provider.hourlyRate,
    });

    const io = req.app.get("io");

    io.to(provider.user.toString()).emit("newBooking", {
      message: "New booking received",
      booking,
      increaseNotificationCount: true,
    });

    await Notification.create({
      user: provider.user,
      message: `New booking received for ${provider.profession}`,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("provider")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    // Find provider profile
    const providerProfile = await Provider.findOne({
      user: req.user._id,
    });

    if (!providerProfile) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Find bookings for this provider
    const bookings = await Booking.find({
      provider: providerProfile._id,
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (status === "completed") {
   const provider = await Provider.findById(
     booking.provider
      );

    booking.earnings = provider.hourlyRate;
    }

    booking.status = status;

    await booking.save();

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProviderDashboard = async (req, res) => {
  try {
    const providerProfile = await Provider.findOne({
      user: req.user._id,
    });

    if (!providerProfile) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const bookings = await Booking.find({
      provider: providerProfile._id,
    });

    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending",
    ).length;

    const acceptedBookings = bookings.filter(
      (booking) => booking.status === "accepted",
    ).length;

    const completedBookings = bookings.filter(
      (booking) => booking.status === "completed",
    ).length;

    const totalEarnings = bookings
      .filter((booking) => booking.status === "completed")
      .reduce(
      (sum, booking) => sum + booking.earnings, 0 );

       const bookingStatusData = [
        {
          name: "Pending",
          value: pendingBookings,
        },
        {
          name: "Accepted",
          value: acceptedBookings,
        },
        {
          name: "Completed",
          value: completedBookings,
        },
     ];

     const monthlyEarningsMap = {};

    bookings.forEach((booking) => {
     if (booking.status === "completed") {
        const month = new Date(
         booking.serviceDate
         ).toLocaleString("default", {
         month: "short",
         });

      monthlyEarningsMap[month] =
       (monthlyEarningsMap[month] || 0) + booking.earnings;
     }
   });

   const monthlyEarnings = Object.entries(
     monthlyEarningsMap
     ).map(([month, earnings]) => ({ month, earnings}));

    res.json({
      totalBookings,
      pendingBookings,
      acceptedBookings,
      completedBookings,
      totalEarnings,
      bookingStatusData,
      monthlyEarnings,
      averageRating: providerProfile.averageRating,
      totalReviews: providerProfile.totalReviews,
      available: providerProfile.available,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  getProviderDashboard,
};
