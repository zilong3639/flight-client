import React from "react";
import "../index.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function HeaderCom({ isLoggedIn, username }) {
  const navigate = useNavigate();
  return (
    <div>
      {/* <Navbar bg="primary" variant="dark"> */}
      <Navbar bg="primary" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="/">Airline Booking</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {isLoggedIn ? (
              <Nav className="ms-auto">
                {/* <span
                  className="text-gray-dark"
                  style={{ marginRight: "1rem" }}
                >
                  Welcome,{" "}
                </span> */}
                <Nav.Link
                  to="/user"
                  className="text-gray-dark hover:text-primary"
                  style={{ marginRight: "1rem" }}
                >
                  {username}
                </Nav.Link>
                <Nav.Link
                  as="button"
                  onClick={() => {
                    navigate("/booking");
                  }}
                >
                  Booking
                </Nav.Link>
                <Nav.Link
                  as="button"
                  onClick={() => {
                    navigate("/logout");
                  }}
                >
                  logout
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link
                  as="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log in
                </Nav.Link>
                <Nav.Link
                  as="button"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Resigter
                </Nav.Link>
              </Nav>
            )}
            {/* <Nav.Link href="/login">Log in</Nav.Link>
              <Nav.Link href="/registerPage">Resigter</Nav.Link> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
export default HeaderCom;
