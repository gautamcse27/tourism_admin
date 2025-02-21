import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAttraction = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: "", location: "", description: "", image_url: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8002/attractions/${id}`)
            .then(response => {
                setFormData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching attraction:", error);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8002/attractions/${id}`, formData)
            .then(() => navigate("/"))
            .catch(error => console.error("Error updating attraction:", error));
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary mb-4">Edit Attraction</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input type="text" name="image_url" className="form-control" value={formData.image_url} onChange={handleChange} required />
                    </div>

                    {/* Image Preview */}
                    <div className="text-center mb-3">
                        <img src={formData.image_url} alt="Attraction" className="img-fluid rounded shadow" style={{ maxWidth: "300px" }} onError={(e) => e.target.src = "https://via.placeholder.com/300"} />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary px-4">Update Attraction</button>
                        <button type="button" className="btn btn-secondary ms-2 px-4" onClick={() => navigate("/")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAttraction;
