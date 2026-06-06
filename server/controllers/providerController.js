const Provider = require("../models/Provider");
const User = require("../models/User");


const createProviderProfile = async (req, res) => {
  try {
    const { profession, experience, skills, hourlyRate, location, bio } =
      req.body;

    // Check existing profile
    const existingProfile = await Provider.findOne({ user: req.user._id });

    if (existingProfile) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    const provider = await Provider.create({
      user: req.user._id,
      profession,
      experience,
      skills,
      hourlyRate,
      location,
      bio,
    });

    const user = await User.findById(req.user._id);

    user.role = "provider";

    await user.save();

    res.status(201).json({
      message: "Provider profile created",
      provider,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const { profession, location, sort, page = 1, limit = 5 } = req.query;

    let filter = {};

    if (profession) {
      filter.profession = profession;
    }

    if (location) {
      filter.location = location;
    }

    let sortOption = {};

    if (sort === "lowToHigh") {
      sortOption.hourlyRate = 1;
    }

    if (sort === "highToLow") {
      sortOption.hourlyRate = -1;
    }

    const providers = await Provider.find(filter)
      .populate("user", "name email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(providers);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.json(provider);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    res.json(provider);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.profession =
      req.body.profession || provider.profession;

    provider.experience =
      req.body.experience || provider.experience;

    provider.skills =
      req.body.skills || provider.skills;

    provider.hourlyRate =
      req.body.hourlyRate || provider.hourlyRate;

    provider.location =
      req.body.location || provider.location;

    provider.bio =
      req.body.bio || provider.bio;

    await provider.save();

    res.json({
      message: "Profile updated",
      provider,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.available = !provider.available;

    await provider.save();

    res.json({
      message: "Availability updated",
      available: provider.available,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProviderProfile,
  getAllProviders,
  getProviderById,
  getMyProviderProfile,
  updateProviderProfile,
  toggleAvailability,
};
