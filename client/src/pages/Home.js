import React, { useState } from 'react';
import Appointment from './Appointment';

const Home = () => {
  const [appointments, setAppointments] = useState([]);

  return (
    <div>
      <h1>Welcome to Emergency Medical Service</h1>
      <Appointment
        isAdmin={true}
        appointments={appointments}
        setAppointments={setAppointments}
      />
    </div>
  );
};

export default Home;
