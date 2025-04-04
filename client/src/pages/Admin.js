import React, { useEffect, useState } from 'react';

function Admin() {
  const [appointments, setAppointments] = useState([]);

  const categoryPriorityMap = {
    Heart: 1,
    Lungs: 2,
    Stomach: 3,
    Bones: 4,
    Skin: 5,
    Other: 6,
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetchAppointments(token); // Fetch directly
  }, []);

  const fetchAppointments = async (token) => {
    try {
      const response = await fetch('https://medico-sfh1.onrender.acom/api/patient/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data && data.patients && data.patients.length > 0) {
        const sorted = data.patients.sort((a, b) => a.priority - b.priority);
        setAppointments(sorted);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const getCategoryName = (priority) =>
    Object.keys(categoryPriorityMap).find(
      (key) => categoryPriorityMap[key] === priority
    ) || 'Other';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Page</h1>
      <p>Welcome! Admin access temporarily bypassed.</p>
      <h2 style={{ marginTop: '30px' }}>Appointment Queue</h2>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Problem</th>
              <th>Medical Category</th>
              <th>System Priority</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.name}</td>
                <td>{appointment.condition}</td>
                <td>{getCategoryName(appointment.priority)}</td>
                <td>{appointment.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
