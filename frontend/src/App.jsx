import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import RegistrationForm from "./components/RegistrationForm";
import AdminPage from "./components/AdminPage";
import StaffPage from "./components/StaffPage";
import AddStaffForm from "./components/AddStaffForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Protected Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/add-staff" element={<AddStaffForm/>} />

        {/* Not Found Route */}
        <Route path="*" element={<h1 className="text-center text-3xl text-red-600 font-bold">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
