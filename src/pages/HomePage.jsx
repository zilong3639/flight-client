import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../commons/axios";
import "../index.css";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const [tripType, setTripType] = useState("");
  const [departAirport, setDepartAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [filteredDepartures, setFilteredDepartures] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [departInput, setDepartInput] = useState(null);
  const [arrivalInput, setArrivalInput] = useState(null);

  const navigate = useNavigate();

  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get("/api/airports");
        setAirports(response);
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      }
    };
    fetchAirports();
  }, []);

  const filterAirports = (input, airports) => {
    if (!input) return [];
    return airports.filter(
      (airport) =>
        airport.airport_name.toLowerCase().includes(input.toLowerCase()) ||
        airport.airport_code.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "oneWay") {
      setReturnDate("");
    }
  };

  const handleSearch = () => {
    try {
      setLoading(true);

      if (!departAirport || !arrivalAirport || !departDate) {
        alert("Please input all required fields");
        return;
      }

      if (tripType === "oneWay") {
        navigate("/flightSelect", {
          state: {
            tripType,
            outbound: {
              departureCode: departAirport.airport_code,
              destinationCode: arrivalAirport.airport_code,
              date: new Date(departDate).toISOString().split("T")[0],
            },
            passengers,
          },
        });
        return;
      }
      if (tripType === "roundTrip") {
        if (!returnDate) {
          alert("Please select return date");
          return;
        }
      }

      navigate("/flightSelect", {
        state: {
          tripType,
          outbound: {
            departureCode: departAirport.airport_code,
            destinationCode: arrivalAirport.airport_code,
            date: new Date(departDate).toISOString().split("T")[0],
          },
          inbound: {
            departureCode: arrivalAirport.airport_code,
            destinationCode: departAirport.airport_code,
            date: new Date(returnDate).toISOString().split("T")[0],
          },
          passengers,
        },
      });
    } catch (error) {
      console.error("Error searching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="bg-white p-4 rounded-3 shadow-sm">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Trip type</Form.Label>
                <div className="d-flex gap-3">
                  <Button
                    variant={
                      tripType === "roundTrip" ? "primary" : "outline-primary"
                    }
                    onClick={() => handleTripTypeChange("roundTrip")}
                  >
                    Round trip
                  </Button>
                  <Button
                    variant={
                      tripType === "oneWay" ? "primary" : "outline-primary"
                    }
                    onClick={() => handleTripTypeChange("oneWay")}
                  >
                    One way
                  </Button>
                </div>
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">From</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Departure airport"
                      value={departInput}
                      onChange={(e) => {
                        setDepartInput(e.target.value);
                        setFilteredDepartures(
                          filterAirports(e.target.value, airports)
                        );
                        if (!e.target.value) {
                          setDepartAirport(null);
                        }
                      }}
                      required
                    />
                    {filteredDepartures.length > 0 && (
                      <ul className="dropdown-list">
                        {filteredDepartures.map((airport) => (
                          <li
                            key={airport.airport_code}
                            className="dropdown-item"
                            onClick={() => {
                              setDepartAirport(airport);
                              setDepartInput(
                                `${airport.airport_name}(${airport.airport_code})`
                              );
                              setFilteredDepartures([]);
                            }}
                          >
                            {airport.airport_name} ({airport.airport_code})
                          </li>
                        ))}
                      </ul>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">To</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Destination airport"
                      value={arrivalInput}
                      onChange={(e) => {
                        setArrivalInput(e.target.value);
                        setFilteredDestinations(
                          filterAirports(e.target.value, airports)
                        );
                        if (!e.target.value) {
                          setArrivalAirport(null);
                        }
                      }}
                      required
                    />
                    {filteredDestinations.length > 0 && (
                      <ul className="dropdown-list">
                        {filteredDestinations.map((airport) => (
                          <li
                            key={airport.airport_code}
                            className="dropdown-item"
                            onClick={() => {
                              setArrivalAirport(airport);
                              setArrivalInput(
                                `${airport.airport_name}(${airport.airport_code})`
                              );
                              setFilteredDestinations([]);
                            }}
                          >
                            {airport.airport_name} ({airport.airport_code})
                          </li>
                        ))}
                      </ul>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {/* ??/???? */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">DepartDate</Form.Label>
                    <Form.Control
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                {tripType === "roundTrip" && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">ReturnDate</Form.Label>
                      <Form.Control
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        disabled={tripType === "oneWay"}
                        required
                      />
                    </Form.Group>
                  </Col>
                )}
              </Row>

              {/* ???? */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Passengers</Form.Label>
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setPassengers((prev) => Math.max(1, prev - 1))
                    }
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    className="text-center"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    min="1"
                    style={{ maxWidth: "80px" }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setPassengers((prev) => prev + 1)}
                  >
                    +
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-2"
                  onClick={handleSearch}
                >
                  Search flights
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
