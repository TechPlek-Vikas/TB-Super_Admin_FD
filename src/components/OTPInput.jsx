import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Button, Stack, Typography } from "@mui/material";
import useToggle from "../hooks/useToggle";
import { Link } from "react-router-dom";
import useLoading from "../hooks/useLoading";

const MAX_OTP_RETRY_LIMIT = 3;

const OTPInput = ({
  numFields,
  onComplete,
  otpExpiryTimeInSeconds,
  userCredential,
  maxOTPRetryLimit = MAX_OTP_RETRY_LIMIT,
}) => {
  const [otp, setOtp] = useState(Array(numFields).fill(""));
  const inputRefs = useRef([]);

  const [remainingTime, setRemainingTime] = useState(otpExpiryTimeInSeconds);
  const { isToggled, setToggleState } = useToggle();
  const [retryCount, setRetryCount] = useState(0);
  const { isLoading, updateLoading } = useLoading();

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime((P) => P - 1);
      }, 1000);

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts early
    } else {
      setToggleState(true);
    }
  }, [remainingTime, setToggleState]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSec = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSec).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      // Ensure only numeric input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < numFields - 1) {
        inputRefs.current[index + 1].focus();
      }

      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, numFields);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      if (pasteData.length === numFields) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleFocus = () => (e) => {
    // Select the text in the input field when it gains focus
    e.target.select();
  };

  const handleResendOTP = async () => {
    if (retryCount >= maxOTPRetryLimit) return; // Prevent retry if the limit is reached

    updateLoading(true);
    try {
      console.log(
        `Resending OTP for: ${userCredential}. Attempt: ${retryCount + 1}`
      );
      // Simulate an API call for OTP resending
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay
      setRemainingTime(otpExpiryTimeInSeconds);
      setToggleState(false);
      setRetryCount((P) => P + 1);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setRemainingTime(0); // Set remaining time to 0 if resending fails
    } finally {
      updateLoading(false);
    }
  };

  return (
    <>
      <Stack gap={2}>
        <Box display="flex" justifyContent="center" gap={2}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={handleFocus(index)} // Add onFocus handler
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center" },
              }}
              variant="outlined"
              size="small"
              sx={{ width: "50px" }}
            />
          ))}
        </Box>

        {!isToggled ? (
          <Typography variant="caption" textAlign={"center"}>
            Resend OTP in :{" "}
            <span style={{ color: "#e74c3c" }}>
              {formatTime(remainingTime)}
            </span>{" "}
            seconds
          </Typography>
        ) : retryCount < maxOTPRetryLimit ? ( // Hide the button if retry limit is reached
          <div style={{ textAlign: "center" }}>
            <Button
              variant="text" // Use "text" for a link-style button
              color="primary"
              onClick={handleResendOTP}
              sx={{ textTransform: "none" }} // Ensure text remains normal
              component={Link} // Make it behave like a Link
              to="#" // Add the URL if needed
              disabled={isLoading}
              title="Resend OTP"
            >
              Resend OTP
            </Button>
            <div style={{ marginTop: 10 }}>
              <span style={{ color: "#e74c3c" }}>
                Remaining attempts: {maxOTPRetryLimit - retryCount}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span style={{ color: "#e74c3c" }}>
              Max OTP retry limit reached.
            </span>
          </div>
        )}
      </Stack>
    </>
  );
};

OTPInput.propTypes = {
  numFields: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  otpExpiryTimeInSeconds: PropTypes.number.isRequired,
  userCredential: PropTypes.string.isRequired,
  maxOTPRetryLimit: PropTypes.number,
};

export default OTPInput;
