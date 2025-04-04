const express = require('express');
const router = express.Router();
const Patient = require('../models/patient.model');
const jwt = require('jsonwebtoken');
const MedicalHistory = require("../models/MedicalHistory");
// 🔧 Removed verifyAdmin middleware

// Add a new patient
router.post('/add', async (req, res) => {
    try {
        console.log("Received data:", req.body); // Debugging log

        const { name, condition, priority, category } = req.body;

        // 🚨 Validate required fields
        if (!name || !condition || !priority || !category) {
            return res.status(400).json({ status: "error", error: "Missing required fields" });
        }

        // Step 1: Create and save the new patient
        const newPatient = await Patient.create({
            name,
            condition,
            priority,
            admittedAt: Date.now(),
        });

        // Step 2: Find existing medical history for this patient
        let historyRecord = await MedicalHistory.findOne({ name });

        if (!historyRecord) {
            // If no history exists, create a new one
            historyRecord = new MedicalHistory({
                name,
                history: [], // ✅ Initialize history array properly
            });
        }

        // ✅ Push new medical history properly
        historyRecord.history.push({
            condition: condition.toString(),
            category: category.toString(),
            recordedAt: new Date(),
        });

        await historyRecord.save();

        // Step 3: Reorder patients by priority & admission time
        const allPatients = await Patient.find().sort({ priority: -1, admittedAt: 1 });

        for (let i = 0; i < allPatients.length; i++) {
            allPatients[i].waitingNumber = i + 1;
            await allPatients[i].save();
        }

        res.json({ status: "ok", patient: newPatient, message: "Patient added successfully!" });

    } catch (err) {
        console.error("Error saving patient:", err);
        res.status(500).json({ status: "error", error: err.message });
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


router.get('/history/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const history = await MedicalHistory.find({ name }).sort({ recordedAt: -1 });

        res.json({ status: "ok", history });
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ status: "error", error: err.message });
    }
});
module.exports = router;
