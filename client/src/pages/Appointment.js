import React, { useState, useEffect } from "react";
import axios from "axios";

const Appointment = ({ isAdmin }) => {
    const [appointments, setAppointments] = useState([]);
    const [name, setName] = useState("");
    const [problem, setProblem] = useState("");
    const [category, setCategory] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const medicalCategories = ["Heart", "Lungs", "Stomach", "Bones", "Skin", "Other"];
    const categoryPriorityMap = { Heart: 1, Lungs: 2,  Bones: 3,Stomach: 4, Skin: 5, Other: 6 };

    useEffect(() => {
        if (!isAdmin) return;

        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://medico-sfh1.onrender.com/api/patient/queue", {
                    headers: { "x-access-token": token },
                });

                const sortedAppointments = res.data.patients.sort((a, b) => a.priority - b.priority);
                setAppointments(sortedAppointments);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            }
        };

        fetchAppointments();
    }, [isAdmin]);

    const addAppointment = async (e) => {
        e.preventDefault();
        if (!name || !problem || !category) return;

        const priority = categoryPriorityMap[category] || 999;

        try {
            await axios.post("https://medico-sfh1.onrender.com/api/patient/add", {
                name,
                condition: problem,
                priority,
                category,
            });

            setSuccessMessage("✅ Appointment added successfully!");
            setName("");
            setProblem("");
            setCategory("");

            setTimeout(() => setSuccessMessage(""), 3000);

            if (isAdmin) {
                const res = await axios.get("https://medico-sfh1.onrender.com/api/patient/queue", {
                    headers: { "x-access-token": localStorage.getItem("token") },
                });
                setAppointments(res.data.patients.sort((a, b) => a.priority - b.priority));
            }
        } catch (err) {
            console.error("Error adding appointment:", err);
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🚑 Emergency Medical Service</h1>

            <form onSubmit={addAppointment} style={{ background: "#f7f7f7", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px #ccc" }}>
                <h2>Add Appointment</h2>
                <div style={{ marginBottom: "10px" }}>
                    <label>Patient Name:</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Problem Description:</label>
                    <br />
                    <input
                        type="text"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Medical Category:</label>
                    <br />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    >
                        <option value="">Select Medical Category</option>
                        {medicalCategories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    ➕ Add Appointment
                </button>
            </form>

            {successMessage && (
                <p style={{ color: "green", marginTop: "15px", fontWeight: "bold", textAlign: "center" }}>
                    {successMessage}
                </p>
            )}

            {isAdmin && (
                <>
                    <h2 style={{ marginTop: "40px", textAlign: "center", color: "#34495e" }}> Appointment Queue</h2>
                    {appointments.length === 0 ? (
                        <p style={{ textAlign: "center" }}>No appointments yet.</p>
                    ) : (
                        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse", boxShadow: "0 0 10px #ddd" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#2ecc71", color: "#fff" }}>
                                    <th style={thStyle}>Waiting Number</th>
                                    <th style={thStyle}>Patient Name</th>
                                    <th style={thStyle}>Problem</th>
                                    <th style={thStyle}>Medical Category</th>
                                    <th style={thStyle}>System Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ecf0f1" : "#fff" }}>
                                        <td style={tdStyle}>{index + 1}</td>
                                        <td style={tdStyle}>{appointment.name}</td>
                                        <td style={tdStyle}>{appointment.condition}</td>
                                        <td style={tdStyle}>
                                            {Object.keys(categoryPriorityMap).find(
                                                (key) => categoryPriorityMap[key] === appointment.priority
                                            ) || "Other"}
                                        </td>
                                        <td style={tdStyle}>{appointment.priority}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

// Reusable style objects
const thStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    fontWeight: "bold",
    textAlign: "center"
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center"
};

export default Appointment;
