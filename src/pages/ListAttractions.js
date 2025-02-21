import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const ListAttractions = () => {
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8002/attractions")
            .then(response => setAttractions(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleDelete = (id) => {
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
                            <Card.Img
                                variant="top"
                                src={attraction.image_url}
                                alt={attraction.name}
                                onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                                style={{height: "200px", objectFit: "cover"}}
                            />
                            <Card.Body>
                        <Card.Title>{attraction.name}</Card.Title>
                        <Card.Text>{attraction.description}</Card.Text>
                        <div className="d-flex justify-content-between">
                             <Link to={`/edit/${attraction.id}`}>
                                <Button variant="warning">Edit</Button>
                            </Link>
                        <Button variant="danger" onClick={() => handleDelete(attraction.id)}>Delete</Button>
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
