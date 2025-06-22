import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Nav,
} from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "../commons/axios";

export default function LoginPage({
  setIsLoggedIn,
  setUsername: setGlobalUsername,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call login service
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", response.username);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("phone", response.phone);
      localStorage.setItem("email", response.email);

      if (response.username != undefined && response.username.length > 0) {
        setIsLoggedIn(true);
        setGlobalUsername(response.username);
        navigate("/");
      } else {
        setError("Login failed. Please check your userInfos.");
      }
    } catch (error) {
      // Display error message
      setError(error.message || "Login failed. Please check your userInfos.");
    } finally {
      setLoading(false);
    }
  };

  // Render loading skeleton during initialization

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">登录</h2>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="d-flex align-items-center">
                    <FaUser className="me-2" /> Email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="d-flex align-items-center">
                    <FaLock className="me-2" /> Password
                  </Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Input password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Form.Text className="d-flex justify-content-end">
                    <Button
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-0"
                    >
                      {showPassword ? "Hide password" : "show password"}
                    </Button>
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Form.Text>
                  Don't have an account yet?
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Register Now
                  </Button>
                </Form.Text>
                <Form.Text className="d-block mt-2">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/updatePwd");
                    }}
                  >
                    forgot password
                  </Button>
                </Form.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
