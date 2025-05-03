const express = require("express");
const router = express.Router();
const Metrics = require("../models/metrics");
const { protect } = require("../middleware/authMiddleware");

// Find based on name
router.get("/search", protect, async (req, res) => {
  console.log("Received request with query:", req.query);
  const { name } = req.query;
  if (!name) {
    return res
      .status(400)
      .json({ message: "Name query parameter is required" });
  }

  try {
    const regex = new RegExp(name, "i");
    const results = await Metrics.find({
      $or: [{ firstName: regex }, { lastName: regex }],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching data", error });
  }
});

router.get("/recent", protect, async (req, res) => {
  const { limit } = req.query;
  const queryLimit = parseInt(limit) || 10;

  try {
    const results = await Metrics.find()
      .sort({ timestamp: -1 })
      .limit(queryLimit);

    res.status(200).json(results);
  } catch (error) {
    console.error("Recent data error:", error);
    res.status(500).json({ message: "Error fetching recent data", error });
  }
});

router.delete("/delete/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Metrics.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting data", error });
  }
});

module.exports = router;
