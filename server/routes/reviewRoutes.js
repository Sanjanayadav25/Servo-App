const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { createReview , getProviderReviews } = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/:providerId", getProviderReviews);

module.exports = router;