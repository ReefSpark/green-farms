import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useFetchCart from "../customhooks/useFetchCart";
import UserRoutes from "../rounting/UserRoutes";
import AdminRoutes from "../rounting/AdminRoutes";

function ManiPage() {
  useFetchCart();
  return (
    <div>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/user/login" replace />} />

          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ManiPage;
