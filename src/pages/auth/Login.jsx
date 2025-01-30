import {  Button,
  Box,
  Typography,
  Stack,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useCallback, useEffect, useState } from "react";
import OTPInput from "../../components/OTPInput";
import useLoading from "../../hooks/useLoading";
import useBeforeUnload from "../../hooks/useBeforeUnload";
import useToggle from "../../hooks/useToggle";

const OTP_LENGTH = 4;
const OTP_EXPIRY_TIME_IN_SECONDS = 5;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otpSent, setOtpSent] = useState(false);

  const { isLoading, updateLoading } = useLoading();
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleGenerateOtp = async (emailOrPhone) => {
    updateLoading(true); // Start loading

    try {
      setEmailOrPhone(emailOrPhone);

      // Simulate an API call for OTP generation
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay
      setOtpSent(true);
      console.log("OTP generated for: ", emailOrPhone);
    } catch (error) {
      console.error("Error generating OTP:", error);
    } finally {
      updateLoading(false); // Stop loading
    }
  };

  const handleVerifyOTP = async (otp) => {
    updateLoading(true); // Start loading
    try {
      // Simulate an API call for OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      console.log("Verifying OTP: ", otp);
      await login();
      navigate("/user-type");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      updateLoading(false); // Stop loading
    }
  };

  return (
    <LoginLayout>
      {!otpSent ? (
        <LoginForm
          onGenerateOtp={handleGenerateOtp}
          otpSent={otpSent}
          loading={isLoading}
        />
      ) : (
        <OTPVerification
          onVerifyOTP={handleVerifyOTP}
          otpLength={OTP_LENGTH}
          loading={isLoading}
          userCredential={emailOrPhone}
        />
      )}
    </LoginLayout>
  );
};
const LoginForm = ({ onGenerateOtp, otpSent, loading }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleGenerateOtp = () => {
    if (emailOrPhone.trim()) {
      onGenerateOtp(emailOrPhone);
    } else {
      alert("Please enter a valid email or phone number.");
    }
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Email or Phone"
        variant="outlined"
        fullWidth
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        disabled={otpSent}
      />
      {!otpSent && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerateOtp}
          startIcon={loading && <CircularProgress size={24} />}
          disabled={loading}
        >
          Get OTP
        </Button>
      )}
    </Stack>
  );
};

const OTPVerification = ({
  onVerifyOTP,
  otpLength,
  userCredential,
  loading,
}) => {
  console.log(`🚀 ~ userCredential:`, userCredential);
  const [otp, setOtp] = useState("");

  const handleOTPComplete = (enteredOTP) => {
    setOtp(enteredOTP);
  };

  const handleVerifyOTP = () => {
    if (otp.length === otpLength) {
      onVerifyOTP(otp);
    } else {
      alert(`Please enter a complete ${otpLength}-digit OTP.`);
    }
  };

  // Add beforeunload event listener
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     // Chrome requires returnValue to be set
  //     event.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  // Enable the `beforeunload` behavior to warn users about potential data loss
  useBeforeUnload(true);

  return (
    <Stack spacing={3}>
      {/* OTP Component */}
      <OTPInput
        numFields={otpLength}
        onComplete={handleOTPComplete}
        otpExpiryTimeInSeconds={OTP_EXPIRY_TIME_IN_SECONDS}
        userCredential={userCredential}
        maxOTPRetryLimit={2}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleVerifyOTP}
        disabled={otp.length !== otpLength || loading}
        startIcon={loading && <CircularProgress size={24} />}
      >
        Verify OTP
      </Button>
    </Stack>
  );
};

const LoginLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        p: 2,
      }}
    >
      <Stack
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
          width: "100%",
          maxWidth: 400,
        }}
        spacing={3}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {children}
      </Stack>
    </Box>
  );
};

export default Login;
