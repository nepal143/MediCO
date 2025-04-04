import React, { useState } from "react";
import axios from "axios";

const SearchHistory = () => {
    const [name, setName] = useState("");
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    const fetchHistory = async () => {
        if (!name.trim()) {
            setError("Please enter a name");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/patients/history/${name}`);
            setHistory(response.data.history);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Error fetching history");
            setHistory([]);
        }
    };

    return (
        <div>
            <h2>Search Patient History</h2>
            <input
                type="text"
                placeholder="Enter Patient Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={fetchHistory}>Search</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {history.length > 0 && (
                <div>
                    <h3>Medical History</h3>
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index}>
                                <strong>Condition:</strong> {entry.condition} | 
                                <strong> Category:</strong> {entry.category} | 
                                <strong> Date:</strong> {new Date(entry.recordedAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchHistory;
