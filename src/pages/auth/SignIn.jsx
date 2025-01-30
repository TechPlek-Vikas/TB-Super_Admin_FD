import PropTypes from "prop-types";import {
  Button,
  Box,
  Typography,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useState } from "react";
import OTPInput from "../../components/OTPInput";
import useLoading from "../../hooks/useLoading";
import useBeforeUnload from "../../hooks/useBeforeUnload";
import useToggle from "../../hooks/useToggle";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { EMAIL_REGEX, PHONE_REGEX } from "../../constants";

const OTP_LENGTH = 4;
const OTP_EXPIRY_TIME_IN_SECONDS = 5;

const SignIn = () => {
  const { isToggled: otpSent, setToggleState: handleOTPSentChange } =
    useToggle();

  return (
    <SignInLayout>
      {!otpSent ? (
        <SignInForm handleOTPSentChange={handleOTPSentChange} />
      ) : (
        <OTPVerification />
      )}
    </SignInLayout>
  );
};

const getOTPValidationSchema = Yup.object({
  emailOrPhone: Yup.string()
    .trim()
    .required("Email or Phone is required")
    .test("is-email-or-phone", "Invalid email or phone number", (value) => {
      return EMAIL_REGEX.test(value) || PHONE_REGEX.test(value);
    }),
});
const SignInForm = ({ handleOTPSentChange }) => {
  const { handleEmailOrPhoneChange, generateOTP } = useAuth();

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
    },
    validationSchema: getOTPValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("form submitted: ", values);
        // Simulate an API call for OTP generation
        await generateOTP(values.emailOrPhone);
        handleOTPSentChange(true);
        handleEmailOrPhoneChange(values.emailOrPhone);
        console.log("OTP generated for: ", values.emailOrPhone);
        resetForm();
      } catch (error) {
        console.error("Error generating OTP:", error);
      }
    },
  });

  const isSubmitDisabled = !formik.dirty || formik.isSubmitting;

  return (
    <>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Email or Phone"
              variant="outlined"
              fullWidth
              autoComplete="off"
              {...formik.getFieldProps("emailOrPhone")}
              error={
                formik.touched.emailOrPhone &&
                Boolean(formik.errors.emailOrPhone)
              }
              helperText={
                formik.touched.emailOrPhone && formik.errors.emailOrPhone
              }
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              startIcon={formik.isSubmitting && <CircularProgress size={24} />}
              disabled={isSubmitDisabled}
              title="Get OTP"
            >
              Get OTP
            </Button>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
};

SignInForm.propTypes = {
  handleOTPSentChange: PropTypes.func.isRequired,
};

const OTPVerification = () => {
  const { emailOrPhone, signInWithOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const { isLoading, updateLoading } = useLoading();

  const navigate = useNavigate();

  const handleOTPComplete = (enteredOTP) => {
    setOtp(enteredOTP);
  };

  const handleVerifyOTP = async () => {
    try {
      if (!(otp.length === OTP_LENGTH)) return;

      updateLoading(true);
      await signInWithOTP({ emailOrPhone, otp });
      navigate("/", { replace: true });
    } catch (error) {
      console.log("Error verifying OTP:", error);
    } finally {
      updateLoading(false);
    }
  };

  // Enable the `beforeunload` behavior to warn users about potential data loss
  useBeforeUnload(true);

  return (
    <Stack spacing={3}>
      {/* OTP Component */}
      <OTPInput
        numFields={OTP_LENGTH}
        onComplete={handleOTPComplete}
        otpExpiryTimeInSeconds={OTP_EXPIRY_TIME_IN_SECONDS}
        userCredential={emailOrPhone}
        maxOTPRetryLimit={2}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleVerifyOTP}
        disabled={otp.length !== OTP_LENGTH || isLoading}
        startIcon={isLoading && <CircularProgress size={24} />}
        title="Verify OTP"
      >
        {/* Verify OTP */}
        Continue
      </Button>
    </Stack>
  );
};

OTPVerification.propTypes = {
  onVerifyOTP: PropTypes.func.isRequired,
  otpLength: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

const SignInLayout = ({ children }) => {
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
          width: "100%",
          maxWidth: 400,
          boxShadow:
            "rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
        }}
        spacing={3}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        {children}
      </Stack>
    </Box>
  );
};

SignInLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SignIn;
