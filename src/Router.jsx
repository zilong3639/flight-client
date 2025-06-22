import { Routes, Route } from "react-router-dom";
import HomePage from "pages/HomePage";
import MyBookingsPage from "pages/MyBookingsPage";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import App from "App";
import FlightSelectPage from "pages/FlightSelectPage";
import BookingFlightPage from "pages/BookingFlightPage";
import BookingConfrimPage from "pages/BookingConfrimPage";
import { Navigate } from "react-router-dom";

const Router = () => (
  <Routes>
    <Route path="/" exact element={<App />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/booking" element={<MyBookingsPage />} />
    <Route path="/registerPage" component={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/flightSelect" element={<FlightSelectPage />} />
    <Route path="/bookingFlight" element={<BookingFlightPage />} />
    <Route path="/bookingConfrim" element={<BookingConfrimPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default Router;
