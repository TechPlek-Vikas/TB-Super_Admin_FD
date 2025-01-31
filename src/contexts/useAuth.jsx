import PropTypes from "prop-types";import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"; // Create an AuthContext
import { TOKEN_KEY } from "../constants";
import axiosInstance from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import useToast from "../hooks/useToast";

const AuthContext = createContext();

const verifyToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);
  console.log(`🚀 ~ verifyToken ~ decoded:`, decoded);

  return decoded.exp > Date.now() / 1000;
};

// AuthProvider component to provide authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleEmailOrPhoneChange = useCallback((value) => {
    setEmailOrPhone(value);
  }, []);

  const { success } = useToast();

  useEffect(() => {
    // Check if user is logged in by checking localStorage/sessionStorage or your preferred method
    const token = localStorage.getItem(TOKEN_KEY); // Example check

    if (!token) return;

    if (verifyToken(token)) {
      setIsAuthenticated(true);
    } else {
      console.log("Session expired");
      success("Session Expired");
      setIsAuthenticated(false);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [success]);

  const signIn = async () => {
    // Call your login logic and set the authentication state
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAuthenticated(true);
    localStorage.setItem(TOKEN_KEY, "true");
  };

  const logout = () => {
    // Call your logout logic and remove authentication state
    setIsAuthenticated(false);
    localStorage.removeItem(TOKEN_KEY);
  };

  const signInWithOTP = async ({ emailOrPhone, otp }) => {
    try {
      console.table({ emailOrPhone, otp });
      const response = await axiosInstance.post(
        "/user/auth/register-or-login",
        {
          emailOrPhone,
          otp,
        }
      );
      setIsAuthenticated(true);
      const token = response.data.data.authToken;
      console.log(`🚀 ~ signInWithOTP ~ token:`, token);
      // localStorage.setItem(TOKEN_KEY, "true");
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.log("Error verifying OTP:", error);
      throw error;
    }
  };

  const generateOTP = async (emailOrPhone) => {
    try {
      // TODO : GENERATE OTP API
      console.table({ emailOrPhone });
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await axiosInstance.post("/user/auth/otp", {
        emailOrPhone,
      });
      console.log(`🚀 ~ generateOTP ~ response:`, response);
    } catch (error) {
      console.log("Error generating OTP:", error);
    }
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
