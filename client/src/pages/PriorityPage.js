import React, { useEffect, useState } from "react";

// Traditional Min-Heap based Priority Queue
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(patient) {
    if (!patient || typeof patient.priority !== "number") return;
    this.queue.push(patient);
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.queue.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.queue[index].priority >= this.queue[parentIndex].priority) break;
      [this.queue[index], this.queue[parentIndex]] = [this.queue[parentIndex], this.queue[index]];
      index = parentIndex;
    }
  }

  dequeue() {
    if (this.queue.length === 1) return this.queue.pop();
    const min = this.queue[0];
    this.queue[0] = this.queue.pop();
    this.bubbleDown();
    return min;
  }

  bubbleDown() {
    let index = 0;
    const length = this.queue.length;
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let smallest = index;

      if (leftChildIndex < length && this.queue[leftChildIndex].priority < this.queue[smallest].priority) {
        smallest = leftChildIndex;
      }
      if (rightChildIndex < length && this.queue[rightChildIndex].priority < this.queue[smallest].priority) {
        smallest = rightChildIndex;
      }
      if (smallest === index) break;
      [this.queue[index], this.queue[smallest]] = [this.queue[smallest], this.queue[index]];
      index = smallest;
    }
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  getItems() {
    const sorted = [];
    while (!this.isEmpty()) {
      sorted.push(this.dequeue());
    }
    return sorted;
  }
}

const PriorityPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token"); // admin token
        const response = await fetch("https://medico-sfh1.onrender.acom/api/patient/queue", {
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
function getPriorityLabel(priority) {
  switch (priority) {
    case 1: return "Critical"; 
    case 2: return "High";    
    case 3: return "Medium";   
    case 4: return "Low";      
    case 5: return "Low";     
    case 6: return "Low";      
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
