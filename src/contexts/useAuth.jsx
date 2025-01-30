import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"; // Create an AuthContext
const AuthContext = createContext();

// AuthProvider component to provide authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleEmailOrPhoneChange = useCallback((value) => {
    setEmailOrPhone(value);
  }, []);

  useEffect(() => {
    // Check if user is logged in by checking localStorage/sessionStorage or your preferred method
    const token = localStorage.getItem("authToken"); // Example check
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = async () => {
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

  const signInWithOTP = async ({ emailOrPhone, otp }) => {
    // TODO : VERIFY OTP API
    console.table({ emailOrPhone, otp });
    console.log("Verifying OTP: ", otp);
    // Call your login logic and set the authentication state
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAuthenticated(true);
    localStorage.setItem("authToken", "true");
  };

  const generateOTP = async (emailOrPhone) => {
    // TODO : GENERATE OTP API
    console.table({ emailOrPhone });
    await new Promise((resolve) => setTimeout(resolve, 5000));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        logout,
        emailOrPhone,
        handleEmailOrPhoneChange,
        signInWithOTP,
        generateOTP,
      }}
    >
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
