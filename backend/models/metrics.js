const mongoose = require("mongoose");

const MetricsSchema = new mongoose.Schema(
  {
    patientId: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },

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
    "Cough >=2 weeks": { type: Boolean },
    "Cough <2 weeks": { type: Boolean },
    Emptysis: { type: Boolean },
    Fever: { type: Boolean },
    Thoracalgia: { type: Boolean },
    Others: { type: String },
    Sympomless: { type: Boolean },
    "Have similar sym before": { type: Boolean },
    "X-ray checking": { type: Boolean },
    "Sputum specimen": { type: Boolean },
    "Tb diagnosed": { type: Boolean },
    "Clinical record checked": { type: Boolean },
    "Anti-tb drug time": { type: String },
    "Patient final type decided": { type: String },
    "Subserotype type": { type: String },
    "TB Type": { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Metrics", MetricsSchema);
