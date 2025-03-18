import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="user/login" replace />;
  }

  // if (!allowedRoles.includes(userRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet context={{ userRole }} />;
};

export default ProtectedRoute;
