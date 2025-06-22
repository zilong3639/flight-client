import { useState, useEffect } from "react";
import { Form, Button, Card, Container, ListGroup } from "react-bootstrap";
import axios from "../commons/axios";
import { useLocation, useNavigate } from "react-router-dom";

function BookingFlightPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, returnFlight, passengers } = location.state;
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || "";
  });
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem("phone") || "";
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [books, setBooks] = useState([]);

  const totalPrice = () => {
    const outboundPrice = flight.economy_price;
    const returnPrice = returnFlight ? returnFlight.economy_price : 0;
    return (outboundPrice + returnPrice) * passengers;
  };

  useEffect(() => {
    const fetchFlights = async () => {
      const flightBooks = [
        {
          user_id: userId,
          flight_id: flight.flight_id,
          total_price: flight.economy_price * passengers,
          contact_phone: phone,
        },
      ];
      setBooks(flightBooks);

      if (returnFlight) {
        const returnFlightBooks = [
          {
            user_id: userId,
            flight_id: returnFlight.flight_id,
            total_price: returnFlight.economy_price * passengers,
            contact_phone: phone,
          },
        ];
        setBooks((prevBooks) => [...prevBooks, ...returnFlightBooks]);
      }
    };
    fetchFlights();
  }, []);

  const handleSubmit = async (e) => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    try {
      const response = await axios.post("/api/book/insert", books);
      navigate("/bookingResult");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h3" className="text-center">
          Confirm Your Flight Booking
        </Card.Header>
        <Card.Body>
          <Card>
            <Card.Header as="h4">OutboundFlight</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Flight Number:</strong> {flight.flight_number}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Departure:</strong> {flight.departureAirportName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Destination:</strong> {flight.destinationAirportName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Departure Time:</strong>{" "}
                  {new Date(flight.departure_time).toLocaleString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Arrival Time:</strong>{" "}
                  {new Date(flight.destination_time).toLocaleString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Number of Passengers:</strong> {passengers}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Price:</strong> {flight.economy_price}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <br></br>
          {returnFlight && (
            <Card>
              <Card.Header as="h4">ReturnFlight</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Flight Number:</strong> {returnFlight.flight_number}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Departure:</strong>{" "}
                    {returnFlight.departureAirportName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Destination:</strong>{" "}
                    {returnFlight.destinationAirportName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Departure Time:</strong>{" "}
                    {new Date(returnFlight.departure_time).toLocaleString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Arrival Time:</strong>{" "}
                    {new Date(returnFlight.destination_time).toLocaleString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Number of Passengers:</strong> {passengers}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Price:</strong> {returnFlight.economy_price}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          <Card>
            {/* <Card.Header as="h4">ReturnFlight</Card.Header> */}
            <Card.Body>
              <strong>TotalPrice:</strong> {totalPrice()}
            </Card.Body>
          </Card>
          <Form className="mt-4">
            <div className="text-center">
              <Button variant="primary" onClick={handleSubmit}>
                Confirm Booking
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookingFlightPage;
