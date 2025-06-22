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
  Spinner,
  Pagination,
} from "react-bootstrap";
import { format } from "date-fns";

const MyBookingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [displaybooks, setDisplayBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || "";
  });

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/book/search", {
          params: { userId: userId },
        });
        setDisplayBooks(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = displaybooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  return (
    <Container className="mt-4">
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
                <span>Find {displaybooks.length} Books</span>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h4>Booking</h4>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead className="table-header">
                      <tr>
                        <th className="cursor-pointer">Flight No</th>
                        <th className="cursor-pointer">Departure</th>
                        <th className="cursor-pointer">Destination</th>
                        <th className="cursor-pointer">Departure Time</th>
                        <th className="cursor-pointer">Destination Time</th>
                        <th className="cursor-pointer">Booking_time</th>
                        <th className="cursor-pointer">Price</th>
                        <th className="cursor-pointer">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBooks.length > 0 ? (
                        currentBooks.map((book) => (
                          <tr key={book.book_id}>
                            <td>{book.flight_number}</td>
                            <td>{book.departureAirportName}</td>
                            <td>{book.destinationAirportName}</td>
                            <td>{formatDate(book.departure_time)}</td>
                            <td>{formatDate(book.destination_time)}</td>
                            <td>{formatDate(book.booking_time)}</td>
                            <td>{book.total_price}</td>
                            <td>{book.status}</td>
                          </tr>
                        ))
                      ) : (
                        <Row>
                          <Col colSpan="6" className="text-center">
                            No matching book found
                          </Col>
                        </Row>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {displaybooks.length > booksPerPage && (
            <Row>
              <Col className="d-flex justify-content-center">
                <Pagination>
                  {Array.from({
                    length: Math.ceil(displaybooks.length / booksPerPage),
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

export default MyBookingsPage;
