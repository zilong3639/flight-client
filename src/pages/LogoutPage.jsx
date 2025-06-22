import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("phone");
    localStorage.removeItem("email");

    // ????????
    navigate("/login");
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center vh-100">
        <Col md={6} className="text-center">
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2>Are you sure you want to log out?</h2>
              <Button variant="primary" onClick={handleLogout} className="mt-3">
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Logout;
