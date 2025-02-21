// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route ,useLocation } from "react-router-dom";
import AttractionsList from "./pages/ListAttractions";
import AddAttraction from "./pages/AddAttraction";
import EditAttraction from "./pages/EditAttraction";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
function AppContent(){
  const location =useLocation();
  const hideNavbar=location.pathname==="/admin-login";
  return(
    <>
      {!hideNavbar && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AttractionsList />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/add-attraction" element={<AddAttraction />} />
          <Route path="/edit/:id" element={<EditAttraction />} />
        </Routes>
      </div>
      </>
  );
}

export default App;
