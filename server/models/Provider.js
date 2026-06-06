const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profession: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    skills: [String],

    hourlyRate: {
      type: Number,
      required: true,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Provider", providerSchema);
