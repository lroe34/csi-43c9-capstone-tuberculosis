const express = require("express");
const router = express.Router();
const csv = require("csvtojson");
const Metrics = require("../models/metrics");

router.post("/", async (req, res) => {
  console.log("Received request to upload data:", req.body);
  try {
    const { csvData } = req.body;
    if (!csvData) {
      return res.status(400).json({ message: "No CSV data provided" });
    }

    const jsonArray = await csv().fromString(csvData);

    //TODO: extra validation here
    const docs = await Metrics.insertMany(jsonArray);
    res.status(200).json({ message: "Data uploaded successfully", docs });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading data", error });
  }
});

router.post("/single", async (req, res) => {
  console.log("Received request to save single record:", req.body);
  try {
    const newRecord = new Metrics({
      ...req.body, 
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
