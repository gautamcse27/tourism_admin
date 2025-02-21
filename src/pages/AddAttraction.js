import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAttraction = () => {
    const [formData, setFormData] = useState({ name: "", location: "", description: "", image_url: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting:", formData); // Debugging
    
        try {
            const response = await axios.post("http://localhost:8002/attractions", formData);
            console.log("Response:", response.data); // Check if backend responds
            navigate("/");
        } catch (error) {
            console.error("Error adding attraction:", error.response?.data || error.message);
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary mb-4">Add New Attraction</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-control" placeholder="Enter attraction name" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" name="location" className="form-control" placeholder="Enter Location"  onChange={handleChange} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" placeholder="Enter description" rows="3" onChange={handleChange} required></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input type="text" name="image_url" className="form-control" placeholder="Enter image URL" onChange={handleChange} required />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success px-4">Add Attraction</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddAttraction;
