import React from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";

const BookingResultPage = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Alert variant="success">
            <Alert.Heading>Booking Successful!</Alert.Heading>
            <p>Your flight booking has been confirmed.</p>
          </Alert>

          <div className="mt-4 text-center">
            <Button variant="primary" href="/">
              Return to Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingResultPage;
