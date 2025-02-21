import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")){
    localStorage.removeItem("adminToken");
    alert("You have been logged out.")
    navigate("/admin-login");
    }
  };
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Admin Panel</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
           
            <li className="nav-item">
              <Link className="nav-link" to="/add-attraction">Add Attraction</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
