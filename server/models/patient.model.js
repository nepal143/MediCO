const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: null }, // Optional age
  condition: { type: String, required: true },
  priority: { type: Number, required: true },
  waitingNumber: { type: Number, default: 0 },
  admittedAt: { type: Date, default: Date.now }, // ✅ Required for sorting
});

module.exports = mongoose.model('Patient', patientSchema);
