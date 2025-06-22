import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "../commons/axios";
import { useNavigate } from "react-router-dom";

const UpdatePwdPage = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    confirmPassword: "",
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setShowError(true);
      setErrorMessage("New passwords do not match");
      return;
    }
    // Here you would typically send the form data to your backend
    console.log("Password Update Data:", formData);
    setShowError(false);
    alert("Password updated successfully!");

    try {
      const response = await axios.post("/api/auth/updatePwd", {
        email: formData.email,
        password: formData.password,
      });
      alert("Update password successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Update password error:", err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Update Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Enter new email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
            </Form.Group>

            {showError && <Alert variant="danger">{errorMessage}</Alert>}

            <Button variant="primary" type="submit" className="w-100">
              Update Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePwdPage;
