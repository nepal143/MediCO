import React, { useEffect, useState } from "react";

// Simple Priority Queue (Min-Heap based for simplicity)
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(patient) {
    if (!patient || typeof patient.priority !== "number") return;
    this.queue.push(patient);
    this.queue.sort((a, b) => a.priority - b.priority); // Min-priority first
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  getItems() {
    return [...this.queue];
  }
}

const PriorityPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token"); // admin token
        const response = await fetch("http://localhost:4000/api/patient/queue", {
          headers: {
            "x-access-token": token,
          },
        });

        const data = await response.json();
        if (data.status === "ok") {
          const pq = new PriorityQueue();
          data.patients.forEach((patient) => pq.enqueue(patient));
          setPatients(pq.getItems()); // Get sorted list
        } else {
          console.error("Failed to fetch patients:", data.error);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px" }}>Patient Priority Queue</h2>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading patients...</p>
      ) : (
        <table
          border="1"
          style={{ width: "90%", margin: "20px auto", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Condition</th>
              <th>Priority Label</th>
              <th>System Priority (1 = Highest)</th>
              <th>Admitted At</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => {
              const priorityLabel = getPriorityLabel(patient.priority);
              const priorityColor = getPriorityColor(priorityLabel);

              return (
                <tr key={index}>
                  <td>{patient.name}</td>
                  <td>{patient.condition}</td>
                  <td style={{ color: priorityColor, fontWeight: "bold" }}>
                    {priorityLabel}
                  </td>
                  <td>{patient.priority}</td>
                  <td>{new Date(patient.admittedAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Convert numeric priority (1–6) to labels
function getPriorityLabel(priority) {
  switch (priority) {
    case 1: return "Critical"; // Heart
    case 2: return "High";     // Lungs
    case 3: return "Medium";   // Stomach
    case 4: return "Low";      // Bones
    case 5: return "Low";      // Skin
    case 6: return "Low";      // Other
    default: return "Unknown";
  }
}

// Set text color based on priority label
function getPriorityColor(label) {
  switch (label.toLowerCase()) {
    case "critical": return "red";
    case "high": return "orangered";
    case "medium": return "orange";
    case "low": return "green";
    default: return "black";
  }
}

export default PriorityPage;
