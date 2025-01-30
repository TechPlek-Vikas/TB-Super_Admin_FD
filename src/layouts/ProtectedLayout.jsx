import PropTypes from "prop-types";import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const drawerWidth = 240;

// Configurable menu items with route
const menuItems = [
  { text: "Home", route: "/" },
  { text: "User Type", route: "/user-type" },
  { text: "Profile", route: "/profile" },
  { text: "Notifications", route: "/notifications" },
];

function ProtectedLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true); // State to control drawer visibility
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen((prevOpen) => !prevOpen); // Toggle drawer visibility
  };

  const { logout } = useAuth();

  const logoutHandler = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#2C3E50", // Darker sidebar background
            color: "white", // Light text color
          },
        }}
        variant="persistent" // Change to persistent for toggle functionality
        anchor="left"
        open={drawerOpen} // Control drawer visibility
      >
        {/* Logo at the top */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h6">Logo</Typography>
        </Box>

        {/* Scrollable Menu Items */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar in WebKit browsers (e.g., Chrome, Safari)
            },
          }}
        >
          {/* <List>
            <ListItem button>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Notifications" />
            </ListItem>
          </List> */}

          {menuItems.map((item) => (
            <ListItem
              // button
              key={item.text}
              component={Link}
              to={item.route}
              sx={{ color: "white" }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </Box>

        {/* Divider */}
        <Divider />

        {/* Logout button at the bottom */}
        <Box sx={{ p: 2, outline: "1px solid #ddd" }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            title="Logout"
            onClick={logoutHandler}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Content Section */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          //   p: 3,
        }}
      >
        {/* Sticky Header */}
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div">
              Sticky Header
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container sx={{ mt: 3 }}>
          {/* {children} */}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default ProtectedLayout;
