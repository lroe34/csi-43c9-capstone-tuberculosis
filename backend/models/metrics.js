const mongoose = require("mongoose");

const MetricsSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    Recurrent: { type: String },
    Gender: { type: String },
    Age: { type: Number },
    "Residence time": { type: Number },
    Nationality: { type: String },
    Occupation: { type: String },
    Education: { type: String },
    Revenue: { type: Number },
    "No. families": { type: Number },
    "Tb in family": { type: Number },
    "Tb in neighbor": { type: Number },
    "Tb contact": { type: String },
    "Cough >=2 weeks": { type: Number },
    "Cough <2 weeks": { type: Number },
    Emptysis: { type: Number },
    Fever: { type: Number },
    Thoracalgia: { type: Number },
    Others: { type: String },
    Sympomless: { type: Number },
    "Have similar sym before": { type: Number },
    "X-ray checking": { type: Number },
    "Sputum specimen": { type: Number },
    "Tb diagnosed": { type: Number },
    "Clinical record checked": { type: Number },
    "Anti-tb drug time": { type: String },
    "Patient final type decided": { type: String },
    "Subserotype type": { type: String },
    "TB Type": { type: String },
    predictionType: { type: String },
    predictionDetails: { type: Object },
  },
  { timestamps: true }
);

MetricsSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model("Metrics", MetricsSchema);
