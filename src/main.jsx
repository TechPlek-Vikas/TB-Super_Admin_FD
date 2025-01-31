import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer />
    </ThemeProvider>
  </StrictMode>
);
