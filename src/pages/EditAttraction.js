import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "300px",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default: India

const EditAttraction = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        description: "",
        images: [],
        latitude: "",
        longitude: "",
        previousImages: []
    });

    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "use api key for map", // 🔹 Replace with your actual API key
        libraries: ["places"],
    });

    useEffect(() => {
        axios.get(`http://localhost:8002/attractions/${id}`)
            .then(response => {
                const data = response.data;
                setFormData({
                    name: data.name || "",
                    location: data.location || "",
                    description: data.description || "",
                    images: Array.isArray(data.images) ? data.images : [],
                    previousImages: Array.isArray(data.images) ? data.images : [],
                    latitude: data.latitude || "",
                    longitude: data.longitude || ""
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching attraction:", error);
                setLoading(false);
            });
    }, [id]);

    const handleMapClick = useCallback((event) => {
        setFormData(prevState => ({
            ...prevState,
            latitude: event.latLng.lat().toFixed(6),
            longitude: event.latLng.lng().toFixed(6)
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.put(`http://localhost:8002/attractions/${id}`, {
            ...formData,
            image_urls: formData.images.filter(img => img.trim() !== ""), // ✅ Remove empty inputs
        })
        .then(() => {
            setSuccessMessage("Attraction updated successfully! ✅");
             // ✅ Scroll to the top
        window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
                setSuccessMessage("");
                navigate("/");
            }, 3000);
        })
        .catch(error => console.error("Error updating attraction:", error));
    };
    

    if (loading || !isLoaded) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary mb-4">Edit Attraction</h2>

                {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.location} 
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                            required 
                        />
                    </div>

                    {/* Google Maps Integration */}
                    <div className="mb-3">
                        <label className="form-label">Select Location on Map</label>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={{
                                lat: formData.latitude ? parseFloat(formData.latitude) : defaultCenter.lat,
                                lng: formData.longitude ? parseFloat(formData.longitude) : defaultCenter.lng
                            }}
                            zoom={10}
                            onClick={handleMapClick}
                        >
                            {formData.latitude && formData.longitude && (
                                <Marker position={{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }} />
                            )}
                        </GoogleMap>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Latitude</label>
                        <input type="text" className="form-control" value={formData.latitude} readOnly />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Longitude</label>
                        <input type="text" className="form-control" value={formData.longitude} readOnly />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-control" 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                            rows="3" 
                            required
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gallery Images</label>
                        {formData.previousImages.length > 0 && (
                            <p className="text-muted">Previous images are already available. You can add more if needed.</p>
                        )}

                        {formData.images.map((image, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={image || ""}
                                    onChange={(e) => {
                                        const updatedImages = [...formData.images];
                                        updatedImages[index] = e.target.value;
                                        setFormData({ ...formData, images: updatedImages });
                                    }}
                                    placeholder="Enter image URL (optional)"
                                />
                                {image && (
                                    <a href={image} target="_blank" rel="noopener noreferrer" className="ms-2">
                                        View Image
                                    </a>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-danger ms-2"
                                    onClick={() => {
                                        const updatedImages = formData.images.filter((_, i) => i !== index);
                                        setFormData({ ...formData, images: updatedImages });
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {/* ✅ Make "Add More Images" optional */}
                        {formData.images.length < 10 && (
                            <button
                                type="button"
                                className="btn btn-secondary mt-2"
                                onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
                            >
                                Add More Images (Optional)
                            </button>
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
