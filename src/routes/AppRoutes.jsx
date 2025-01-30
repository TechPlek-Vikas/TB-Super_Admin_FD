import { Routes, Route } from "react-router-dom";import ProtectedRoute from "./ProtectedRoute";
import { lazy, Suspense } from "react";
import Loader from "../components/loader/Loader";
import ProtectedLayout from "../layouts/ProtectedLayout";
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import PublicProtectedLayout from "../layouts/PublicProtectedLayout";
import { useAuth } from "../contexts/useAuth";

// Lazy-loaded components
const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const UserType = lazy(() => import("../pages/user-type/UserType"));
const NotFound = lazy(() => import("../pages/error/NotFound"));

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public-Protected Route */}
        <Route element={<PublicProtectedLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/res" element={<ResponsiveDrawer />} />
        </Route>

        {/* Secured Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/user-type" element={<UserType />} />
          </Route>
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route
          element={
            isAuthenticated ? <ProtectedLayout /> : <PublicProtectedLayout />
          }
        >
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
