const express = require('express');
const router = express.Router();
const Patient = require('../models/patient.model');
const jwt = require('jsonwebtoken');

// 🔧 Removed verifyAdmin middleware

// Add a new patient
router.post('/add', async (req, res) => {
  try {
    const { name, condition, priority } = req.body;

    const newPatient = await Patient.create({
      name,
      condition,
      priority,
      admittedAt: Date.now(), // Optional since schema has default
    });

    const allPatients = await Patient.find().sort({ priority: -1, admittedAt: 1 });

    allPatients.forEach(async (patient, index) => {
      patient.waitingNumber = index + 1;
      await patient.save();
    });

    res.json({ status: 'ok', patient: newPatient, message: "Patient added successfully!" });
  } catch (err) {
    console.error("Error saving patient:", err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// ✅ Get all patients (no admin check now)
router.get('/queue', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ priority: -1, admittedAt: 1 });
    res.json({ status: 'ok', patients });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.get('/waiting-number/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ status: "error", error: "Patient not found" });
    }
    res.json({ status: "ok", waitingNumber: patient.waitingNumber });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
