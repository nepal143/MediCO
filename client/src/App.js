import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/login';
import Register from './pages/register';
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import PriorityPage from "./pages/PriorityPage"; // ✅ ADD THIS LINE
import Team from "./pages/Team";

function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="priority-table" element={<PriorityPage />} /> {/* ✅ ADD THIS ROUTE */}
          <Route path="Team" element={<Team />} />
        </Routes>
      </BrowserRouter>
    </div> 
  );
}

export default App;
