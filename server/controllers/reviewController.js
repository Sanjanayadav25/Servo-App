const Review = require("../models/Review");
const Provider = require("../models/Provider");
const mongoose = require("mongoose");

const createReview = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;

    // Check provider exists
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Create review
    const review = await Review.create({
      customer: req.user._id,
      provider: providerId,
      rating,
      comment,
    });
    const stats = await Review.aggregate([
  {
    $match: {
      provider: new mongoose.Types.ObjectId(providerId),
    },
  },
  {
    $group: {
      _id: "$provider",
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 },
    },
  },
]);

await Provider.findByIdAndUpdate(providerId, {
  averageRating: stats[0].averageRating,
  totalReviews: stats[0].totalReviews,
});
await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createReview, getProviderReviews
};