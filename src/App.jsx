import { useState } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "antd/dist/reset.css";
import "./index.css";
import HomePage from "./pages/HomePage";
import FlightSelectPage from "./pages/FlightSelectPage";
import BookingFlightPage from "./pages/BookingFlightPage";
import BookingResultPage from "./pages/BookingResultPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdatePwdPage from "./pages/UpdatePwdPage";
import HeaderCom from "./components/HeaderCom";
import LogoutPage from "./pages/LogoutPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <HeaderCom isLoggedIn={isLoggedIn} username={username} />
        <main className="main-content">
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/booking" element={<MyBookingsPage />} />
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUsername={setUsername}
                />
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/updatePwd" element={<UpdatePwdPage />} />
            <Route path="/flightSelect" element={<FlightSelectPage />} />
            <Route path="/bookingFlight" element={<BookingFlightPage />} />
            <Route path="/bookingResult" element={<BookingResultPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
