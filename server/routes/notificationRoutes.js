const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMyNotifications, markNotificationRead, getUnreadCount} = require("../controllers/notificationController");

router.get("/my-notifications", protect, getMyNotifications);
router.put("/:id/read", protect, markNotificationRead);
router.get("/unread-count", protect, getUnreadCount);

module.exports = router;
