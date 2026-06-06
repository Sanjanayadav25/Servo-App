const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { createProviderProfile ,  getAllProviders, getProviderById , getMyProviderProfile,updateProviderProfile, toggleAvailability, } = require("../controllers/providerController");


router.post("/", protect, createProviderProfile);

router.get(
  "/my-profile",
  protect,
  getMyProviderProfile
);

router.get("/", getAllProviders);
router.put( "/update-profile", protect, updateProviderProfile);
router.put( "/toggle-availability", protect, toggleAvailability);
router.get("/:id", getProviderById);



module.exports = router;