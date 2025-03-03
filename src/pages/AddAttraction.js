import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAttraction = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        imageUrls: [""]
    });

    const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = value;
        setFormData({ ...formData, imageUrls: newImageUrls });
    };

    const addImageField = () => {
        if (formData.imageUrls.length < 10) {
            setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
        }
    };

    const removeImageField = (index) => {
        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
        setFormData({ ...formData, imageUrls: newImageUrls });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting:", formData);
    
        try {
            const response = await axios.post("http://localhost:8002/attractions", formData);
            console.log("Response:", response.data);

            setSuccessMessage("Attraction added successfully! ✅"); // ✅ Show success message
            window.scrollTo(0, 0); // ✅ Scroll to top

            setTimeout(() => {
                setSuccessMessage(""); // ✅ Clear message
                navigate("/"); // ✅ Redirect after 3 seconds
            }, 3000);
        } catch (error) {
            console.error("Error adding attraction:", error.response?.data || error.message);
        }
    };
    
    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary mb-4">Add New Attraction</h2>

                {/* ✅ Success Message */}
                {successMessage && (
                    <div className="alert alert-success text-center">{successMessage}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-control" placeholder="Enter attraction name" onChange={handleChange} required />
                    </div>

                    {/* ✅ Location and Coordinates Fields */}
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" name="location" className="form-control" placeholder="Enter Location" onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Latitude</label>
                            <input 
                                type="text" 
                                name="latitude" 
                                className="form-control" 
                                placeholder="Enter latitude" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Longitude</label>
                            <input 
                                type="text" 
                                name="longitude" 
                                className="form-control" 
                                placeholder="Enter longitude" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" placeholder="Enter description" rows="3" onChange={handleChange} required></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gallery Images (Max 10)</label>
                        {formData.imageUrls.map((url, index) => (
                            <div key={index} className="d-flex mb-2">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder={`Image URL ${index + 1}`}
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    required
                                />
                                {index > 0 && (
                                    <button type="button" className="btn btn-danger" onClick={() => removeImageField(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        {formData.imageUrls.length < 10 && (
                            <button type="button" className="btn btn-secondary" onClick={addImageField}>Add Image</button>
                        )}
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-success px-4">Add Attraction</button>
                        <button type="button" className="btn btn-secondary ms-2 px-4" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAttraction;
