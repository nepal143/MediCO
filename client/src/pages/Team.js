import React from 'react';
import './App.css';

const teamPageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: '40px 24px',
  margin: '40px auto',
  maxWidth: '400px',
};

const headingStyle = {
  fontSize: '2.5rem',
  color: '#2d3a4b',
  marginBottom: '16px',
  fontWeight: 700,
  letterSpacing: '2px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 16px 0',
  width: '100%',
};

const listItemStyle = {
  fontSize: '1.25rem',
  color: '#3a506b',
  background: '#fff',
  borderRadius: '8px',
  margin: '8px 0',
  padding: '10px 0',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  textAlign: 'center',
  fontWeight: 500,
};

const descStyle = {
  color: '#5c677d',
  fontSize: '1rem',
  marginTop: '12px',
  textAlign: 'center',
};

function Team() {
  return (
    <div style={teamPageStyle}>
      <h1 style={headingStyle}>Team RJ19</h1>
      <ul style={listStyle}>
        <li style={listItemStyle}>Vishal Suthar</li>
        <li style={listItemStyle}>Nepal Singh</li>
      </ul>
      <p style={descStyle}>This project is developed by <b>Team RJ19</b>.</p>
    </div>
  );
}

export default Team;
