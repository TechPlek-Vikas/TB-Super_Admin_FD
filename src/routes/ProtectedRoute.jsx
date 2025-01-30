import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
const ProtectedRoute = () => {
  // const isAuthenticated = localStorage.getItem("authToken") === "true";
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
