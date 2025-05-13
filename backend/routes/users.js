const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Metric = require("../models/metrics");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { fullName, email, password, confirmPassword, isDoctor } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      isDoctor
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: existingUser._id,
      email: existingUser.email,
      isDoctor: existingUser.isDoctor,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 60 * 60 * 1000, // 1 hr in millis
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        isDoctor: existingUser.isDoctor,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

router.post("/request-deletion", protect, async (req, res) => {
  const { password } = req.body;
  const userId = req.user._id;

  if (!password) {
    return res
      .status(400)
      .json({ message: "Password confirmation is required." });
  }

  try {
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, userToDelete.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password confirmation." });
    }

    console.log(`Deleting metrics associated with userId: ${userId}`);
    const deleteMetricsResult = await Metric.deleteMany({ userId: userId });
    console.log(`Deleted ${deleteMetricsResult.deletedCount} metric records.`);

    console.log(`Deleting user account for userId: ${userId}`);
    await User.findByIdAndDelete(userId);
    console.log(`User account ${userId} deleted.`);

    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
    });

    res
      .status(200)
      .json({
        message:
          "Your account and associated data have been successfully deleted.",
      });
  } catch (error) {
    console.error("Error during data deletion request:", error);
    res
      .status(500)
      .json({ message: "Server error processing your deletion request." });
  }
});

module.exports = router;
