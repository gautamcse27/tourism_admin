import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};
const defaultCenter = { lat: 25.4691, lng: 84.4633 }; // Default location (Bhojpur)

const AddAttraction = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng,
        description: "",
        imageUrls: [""],
    });

    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "use api_key for map", // Replace with your actual API Key
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMapClick = (event) => {
        setFormData({
            ...formData,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting:", formData);

        try {
            const response = await axios.post("http://localhost:8002/attractions", formData);
            console.log("Response:", response.data);

            setSuccessMessage("Attraction added successfully! ✅");
            window.scrollTo(0, 0);

            setTimeout(() => {
                setSuccessMessage("");
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Error adding attraction:", error.response?.data || error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary mb-4">Add New Attraction</h2>

                {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-control" placeholder="Enter attraction name" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" name="location" className="form-control" placeholder="Enter Location" onChange={handleChange} required />
                    </div>

                    {/* Google Map Picker */}
                    <div className="mb-3">
                        <label className="form-label">Pick Location on Map</label>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={10}
                            center={{ lat: formData.latitude, lng: formData.longitude }}
                            onClick={handleMapClick}
                        >
                            <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                        </GoogleMap>
                        <p className="text-muted mt-2">
                            Click on the map to select a location.
                        </p>
                    </div>

                    {/* Auto-Filled Latitude & Longitude */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Latitude</label>
                            <input type="text" name="latitude" className="form-control" value={formData.latitude} readOnly />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Longitude</label>
                            <input type="text" name="longitude" className="form-control" value={formData.longitude} readOnly />
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
                                    onChange={(e) => {
                                        const newImageUrls = [...formData.imageUrls];
                                        newImageUrls[index] = e.target.value;
                                        setFormData({ ...formData, imageUrls: newImageUrls });
                                    }}
                                    required
                                />
                                {index > 0 && (
                                    <button type="button" className="btn btn-danger" onClick={() => {
                                        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
                                        setFormData({ ...formData, imageUrls: newImageUrls });
                                    }}>Remove</button>
                                )}
                            </div>
                        ))}
                        {formData.imageUrls.length < 10 && (
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
                            }}>Add Image</button>
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
