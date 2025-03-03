import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAttraction = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ name: "", location: "", description: "", images: [""] });
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(""); // ✅ State for success message
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8002/attractions/${id}`)
            .then(response => {
                setFormData({ ...response.data, images: response.data.images || [""] });
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

    const handleImageChange = (index, value) => {
        const updatedImages = [...formData.images];
        updatedImages[index] = value;
        setFormData({ ...formData, images: updatedImages });
    };

    const addImageField = () => {
        if (formData.images.length < 10) {
            setFormData({ ...formData, images: [...formData.images, ""] });
        }
    };

    const removeImageField = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8002/attractions/${id}`, formData)
            .then(() => {
                setSuccessMessage("Attraction updated successfully! ✅"); // ✅ Show success message
                window.scrollTo(0, 0); // ✅ Scroll to top
                setTimeout(() => {
                    setSuccessMessage(""); // ✅ Clear message after 3 sec
                    navigate("/"); // ✅ Redirect to home page
                }, 3000);
            })
            .catch(error => console.error("Error updating attraction:", error));
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary mb-4">Edit Attraction</h2>

                {/* ✅ Success Message */}
                {successMessage && (
                    <div className="alert alert-success text-center">{successMessage}</div>
                )}

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
                        <label className="form-label">Gallery Images</label>
                        {formData.images.map((image, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input type="text" className="form-control" value={image} onChange={(e) => handleImageChange(index, e.target.value)} required />
                                {formData.images.length > 1 && (
                                    <button type="button" className="btn btn-danger ms-2" onClick={() => removeImageField(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        {formData.images.length < 10 && (
                            <button type="button" className="btn btn-secondary mt-2" onClick={addImageField}>Add More Images</button>
                        )}
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
