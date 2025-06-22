import { useState, useEffect } from "react";
import "../index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../commons/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { FaPlane, FaSort } from "react-icons/fa";

const FlightSelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [outboundFlight, setOutboundFlight] = useState(null);
  const { tripType, passengers } = location.state || {};
  const [displayFlights, setDisplayFlights] = useState([]);
  const [displayInFlights, setDisplayInFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "flightNo",
    direction: "asc",
  });

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const { outbound, inbound } = location.state;

        const outboundFlights = await axios.get("/api/flights/flightSelect", {
          params: outbound,
        });

        if (location.state.tripType === "roundTrip") {
          const inboundFlights = await axios.get("/api/flights/flightSelect", {
            params: inbound,
          });
          // setFlights({
          //   outbound: outboundFlights,
          //   inbound: inboundFlights,
          // });
          setDisplayFlights(outboundFlights);
          setDisplayInFlights(inboundFlights);
        } else {
          // setFlights({
          //   outbound: outboundFlights,
          //   inbound: null,
          // });
          setDisplayFlights(outboundFlights);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  // if (outboundFlight && tripType === "roundTrip") {
  //   // setFlights(flights.inbound);
  //   setDisplayFlights(flights.inbound);
  // } else {
  //   // setFlights(flights.outbound);
  //   setDisplayFlights(flights.outbound);
  // }
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedFlights = [...displayFlights].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setDisplayFlights(sortedFlights);
  };

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = displayFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center">
            <FaPlane className="me-2" />
            {tripType === "roundTrip" && outboundFlight
              ? "Select Return Flight"
              : "Out Flight List"}
          </h2>
        </Col>
      </Row>
      {location.state?.outbound?.date && (
        <div className="search-date-info">
          <h3>
            {tripType === "roundTrip"
              ? `Departure: ${location.state.outbound.date} | Return: ${location.state.inbound.date}`
              : `Date: ${location.state.outbound.date}`}
          </h3>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <span>Find {displayFlights.length} flights</span>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h4>Outbound Flight</h4>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead className="table-header">
                      <tr>
                        <th
                          onClick={() => requestSort("flight_number")}
                          className="cursor-pointer"
                        >
                          Flight No <FaSort className="sort-icon" />
                        </th>
                        <th
                          onClick={() => requestSort("departureAirportName")}
                          className="cursor-pointer"
                        >
                          Departure <FaSort className="sort-icon" />
                        </th>
                        <th
                          onClick={() => requestSort("destinationAirportName")}
                          className="cursor-pointer"
                        >
                          Destination <FaSort className="sort-icon" />
                        </th>
                        <th
                          onClick={() => requestSort("departure_time")}
                          className="cursor-pointer"
                        >
                          Departure Time <FaSort className="sort-icon" />
                        </th>
                        <th
                          onClick={() => requestSort("destination_time")}
                          className="cursor-pointer"
                        >
                          Destination Time <FaSort className="sort-icon" />
                        </th>
                        <th
                          onClick={() => requestSort("economy_price")}
                          className="cursor-pointer"
                        >
                          Price <FaSort className="sort-icon" />
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFlights.length > 0 ? (
                        currentFlights.map((flight) => (
                          <tr key={flight.flight_id}>
                            <td>{flight.flight_number}</td>
                            <td>{flight.departureAirportName}</td>
                            <td>{flight.destinationAirportName}</td>
                            <td>{flight.departure_time}</td>
                            <td>{flight.destination_time}</td>
                            <td>{flight.economy_price}</td>
                            <td>
                              <Button
                                className="listButton"
                                onClick={() => {
                                  if (
                                    tripType === "roundTrip" &&
                                    !outboundFlight
                                  ) {
                                    setOutboundFlight(flight);
                                    setDisplayFlights(displayInFlights);
                                  } else {
                                    navigate("/bookingFlight", {
                                      state: {
                                        flight: {
                                          ...(tripType === "roundTrip"
                                            ? outboundFlight
                                            : flight),
                                          date:
                                            tripType === "roundTrip"
                                              ? location.state.outbound.date
                                              : location.state.outbound.date,
                                        },
                                        returnFlight:
                                          tripType === "roundTrip"
                                            ? {
                                                ...flight,
                                                date: location.state.inbound
                                                  .date,
                                              }
                                            : null,
                                        passengers,
                                      },
                                    });
                                  }
                                }}
                              >
                                Book
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <Row>
                          <Col colSpan="6" className="text-center">
                            No matching flight found
                          </Col>
                        </Row>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {displayFlights.length > flightsPerPage && (
            <Row>
              <Col className="d-flex justify-content-center">
                <Pagination>
                  {Array.from({
                    length: Math.ceil(displayFlights.length / flightsPerPage),
                  }).map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default FlightSelectPage;
