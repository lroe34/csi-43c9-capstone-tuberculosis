const express = require("express");
const router = express.Router();
const csv = require("csvtojson");
const Metrics = require("../models/metrics");
const { protect } = require("../middleware/authMiddleware");

router.post("/single", protect, async (req, res) => {
  const userId = req.user._id;

  console.log(
    `Received request to save single record for user: ${userId}`,
    req.body
  );

  try {
    const newRecord = new Metrics({
      ...req.body,
      userId: userId,
      timestamp: new Date(),
    });

    const savedDoc = await newRecord.save();

    res
      .status(201)
      .json({ message: "Record saved successfully", doc: savedDoc });
  } catch (error) {
    console.error("Save record error:", error);
    res
      .status(500)
      .json({ message: "Error saving record", error: error.message });
  }
});

module.exports = router;
