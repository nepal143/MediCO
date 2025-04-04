const mongoose = require("mongoose");

const MedicalHistorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  history: [
    {
      condition: { type: String, required: true },
      category: { type: String, required: true },
      recordedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("MedicalHistory", MedicalHistorySchema);
