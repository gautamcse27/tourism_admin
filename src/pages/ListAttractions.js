import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, Button, Container, Row, Col, Carousel } from "react-bootstrap";

const ListAttractions = () => {
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8002/attractions")
            .then(response => setAttractions(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleDelete = (id, name) => {
        // ✅ Show confirmation popup
        const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmDelete) return;

        axios.delete(`http://localhost:8002/attractions/${id}`)
            .then(() => setAttractions(attractions.filter(attraction => attraction.id !== id)))
            .catch(error => console.error("Error deleting:", error));
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Attractions</h2>
                <Link to="/add-attraction">
                    <Button variant="primary"> Add New Attraction</Button>
                </Link>
            </div>

            <Row>
                {attractions.map(attraction => (
                    <Col key={attraction.id} md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Carousel>
                                {attraction.image_urls && attraction.image_urls.length > 0 ? (
                                    attraction.image_urls.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <Card.Img
                                                variant="top"
                                                src={image}
                                                alt={attraction.name}
                                                onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <Card.Img
                                            variant="top"
                                            src="https://via.placeholder.com/100"
                                            alt={attraction.name}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            <Card.Body>
                                <Card.Title>{attraction.name}</Card.Title>
                                
                                {/* ✅ Location Added */}
                                <Card.Subtitle className="mb-2 text-muted">{attraction.location}</Card.Subtitle>

                                <Card.Text>{attraction.description}</Card.Text>
                                
                                <div className="d-flex justify-content-between">
                                    <Link to={`/edit/${attraction.id}`}>
                                        <Button variant="warning">Edit</Button>
                                    </Link>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleDelete(attraction.id, attraction.name)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                <div className="mt-2 text-center">
                                    <Link to={`/gallery/${attraction.id}`}>
                                        <Button variant="info">View Gallery</Button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ListAttractions;
