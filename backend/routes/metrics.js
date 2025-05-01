const express = require("express");
const router = express.Router();
const Metrics = require("../models/metrics");

// Find based on name
router.get("/search", async (req, res) => {
  console.log("Received request with query:", req.query);
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Name query parameter is required" });
  }

  try {
    const regex = new RegExp(name, "i");
    const results = await Metrics.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
      ],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching data", error });
  }
});




module.exports = router;