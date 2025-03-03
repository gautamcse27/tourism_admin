import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";

const GalleryPage = () => {
    const { id } = useParams();
    console.log("Gallery ID:", id);
    const [images, setImages] = useState([]);
    const [attractionName, setAttractionName] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8002/attractions/${id}/gallery`)
            .then(response => {
                console.log("Gallery Data:", response.data);  // Debugging
                setImages(response.data.images || []);  // Ensure images is an array
                setAttractionName(response.data.name || "Unknown Attraction");
            })
            .catch(error => {
                console.error("Error fetching gallery images:", error);
                setError("Error fetching gallery images");
            });
    }, [id]);

    return (
        <Container className="mt-4">
            <h2>{attractionName} Gallery</h2>
            {error ? <p className="text-danger">{error}</p> : null}
            <Row>
                {images.length > 0 ? (
                    images.map((imgUrl, index) => (
                        <Col key={index} md={4} className="mb-3">
                            <Card>
                                <Card.Img 
                                    variant="top" 
                                    src={imgUrl} 
                                    alt={`Gallery Image ${index + 1}`} 
                                    onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                />
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No images available.</p>
                )}
            </Row>
        </Container>
    );
};

export default GalleryPage;
