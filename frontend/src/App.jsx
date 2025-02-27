import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import RegistrationForm from "./components/RegistrationForm";

import AdminPage from "../src/components/Admin/AdminPage"
import AddStaffForm from "../src/components/Admin/AddStaffForm";
import StaffPage from "../src/components/Staff/StaffPage";
import Layout from "./components/LandingPage/Layout";
import Home from "./components/LandingPage/Home";
import About from "./components/LandingPage/About";
import Contact from "./components/LandingPage/ContactUs";

function App() {
  return (
    <Router>
      <Routes>

      <Route path='/' element={<Layout/>}>
          <Route path='' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
      </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Protected Routes */}
        <Route path="/home-page" element={<HomePage />} />

        {/* Staff Pages */}
        <Route path="/staff" element={<StaffPage />} />

      {/* Admin Pages */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/add-staff" element={<AddStaffForm/>} />

        {/* Not Found Route */}
        <Route path="*" element={<h1 className="text-center text-3xl text-red-600 font-bold">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
