import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
const PublicProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicProtectedLayout;
