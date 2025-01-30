import PropTypes from "prop-types";import { createContext, useContext, useEffect, useState } from "react"; // Create an AuthContext
const AuthContext = createContext();

// AuthProvider component to provide authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking localStorage/sessionStorage or your preferred method
    const token = localStorage.getItem("authToken"); // Example check
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async () => {
    // Call your login logic and set the authentication state
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAuthenticated(true);
    localStorage.setItem("authToken", "true");
  };

  const logout = () => {
    // Call your logout logic and remove authentication state
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
