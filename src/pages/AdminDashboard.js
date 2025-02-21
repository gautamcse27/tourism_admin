import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin-dashboard"); // Redirect to login if no token
        }
    }, [navigate]);

    // Logout function
    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")){
        localStorage.removeItem("adminToken");
        alert("You have been logged out.")
        navigate("/admin-login");
        }
      };
     

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Admin Dashboard</h1>
            
        </div>
    );
};

export default AdminDashboard;
