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
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Home,
  Group,
  PersonAdd,
  ExpandMore,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../theme/ColorModeContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserEmail(user.email);
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    auth.signOut();
    window.location.href = "/";
  };

  const navItems = (
    <>
      <ListItem button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
        <ListItemIcon><Home /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>

      <ListItem button component={Link} to="/create-coach" onClick={() => setDrawerOpen(false)}>
        <ListItemIcon><Group /></ListItemIcon>
        <ListItemText primary="Create New Coach" />
      </ListItem>

      <ListItem button onClick={() => {
        navigate("/clients");
        setDrawerOpen(false);
      }}>
        <ListItemIcon><Group /></ListItemIcon>
        <ListItemText primary="View All Clients" />
      </ListItem>

      <ListItem button onClick={() => {
        navigate("/add-client");
        setDrawerOpen(false);
      }}>
        <ListItemIcon><PersonAdd /></ListItemIcon>
        <ListItemText primary="Add Client" />
      </ListItem>

      <Divider />

      <ListItem button onClick={handleLogout}>
        <ListItemIcon><Logout /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" noWrap component="div">
              Anomaly Coaching
            </Typography>

            {!isMobile && (
              <Typography variant="subtitle2" sx={{ ml: 2, fontStyle: "italic" }}>
                {userEmail ? `Logged in as: ${userEmail}` : "Not logged in"}
              </Typography>
            )}

            {!isMobile && (
              <>
                <Button color="inherit" component={Link} to="/" startIcon={<Home />}>
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/create-coach" startIcon={<Group />}>
                  Create Coach
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Group />}
                  endIcon={<ExpandMore />}
                  onClick={handleMenuOpen}
                >
                  Clients
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Right Side - Dark Mode */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Dropdown Menu (desktop) */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate("/clients"); handleMenuClose(); }}>
          View All Clients
        </MenuItem>
        <MenuItem onClick={() => { navigate("/add-client"); handleMenuClose(); }}>
          <PersonAdd sx={{ mr: 1 }} />
          Add Client
        </MenuItem>
      </Menu>

      {/* Drawer Menu (mobile only) */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, mt: 2 }} role="presentation">
          <List>{navItems}</List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
