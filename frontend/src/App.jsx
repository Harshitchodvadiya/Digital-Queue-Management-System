import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "./App.css";

import LoginForm from "./components/LoginForm";
import UserPage from "./components/User/UserPage";
import RegistrationForm from "./components/RegistrationForm";

import AdminPage from "./components/Admin/AdminPage";
import AddStaffForm from "./components/Admin/AddStaffForm";
import StaffPage from "./components/Staff/StaffPage";
import Layout from "./components/LandingPage/Layout";
import Home from "./components/LandingPage/Home";
import About from "./components/LandingPage/About";
import Contact from "./components/LandingPage/ContactUs";
import StaffList from "./components/Staff/StaffList";
import ServiceList from "./components/Admin/ServiceList";
import AddServiceForm from "./components/Admin/AddServiceForm";

function App() {
  // const { isAuthenticated, role } = useAuthentication(); // Get auth status and role

  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>; // Prevent flickering
  // }

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Protected Routes */}
        <Route path="/user" element={<UserPage /> }/>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/staff-list"  element={<StaffList />}  />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />}  />
        <Route path="/add-staff" element={<AddStaffForm />}  />
        <Route path="/service-list" element={<ServiceList />}  />
        <Route path="/add-service" element={<AddServiceForm /> } />

        {/* 404 Not Found */}
        <Route path="*" element={<h1 className="text-center text-3xl text-red-600 font-bold">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
