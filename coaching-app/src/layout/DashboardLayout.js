import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  CssBaseline,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Home,
  Group,
  PersonAdd,
  ExpandMore,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../theme/ColorModeContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left: App Name + Nav Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" component="div">
              Anomaly Coaching
            </Typography>

            {/* User email displayed here */}
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ ml: 3, fontStyle: "italic" }}
            >
              {userEmail ? `Logged in as: ${userEmail}` : "You are not logged in"}
            </Typography>

            {/* Home */}
            <Button
              color="inherit"
              component={Link}
              to="/"
              startIcon={<Home />}
            >
              Home
            </Button>
            <Button
              color="inherit"
              startIcon={<Group />}
              component={Link}
              to="/create-coach"
            >
              Create New Coach
            </Button>
            {/*}
             <Button
              color="inherit"
              component={Link}
              to="/coach-login"
            >
              Coach Login
            </Button>
            */}
             {/* New Client Login Button */}
             {/*}
            <Button
              color="inherit"
              component={Link}
              to="/client-login"
            >
              Client Login
            </Button>
            */}

            {/* Clients Dropdown */}
            <Button
              color="inherit"
              startIcon={<Group />}
              endIcon={<ExpandMore />}
              onClick={handleMenuOpen}
            >
              Clients
            </Button>

            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                auth.signOut();
                window.location.href = "/";
              }}
            >
              Logout
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  navigate("/clients");
                  handleMenuClose();
                }}
              >
                View All Clients
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/add-client");
                  handleMenuClose();
                }}
              >
                <PersonAdd sx={{ mr: 1 }} />
                Add Client
              </MenuItem>
            </Menu>
          </Box>

          {/* Right: Dark Mode Toggle */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
