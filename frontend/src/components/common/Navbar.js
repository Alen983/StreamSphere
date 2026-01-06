// src/components/common/Navbar.js
import { useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import {
  Person,
  Bookmark,
  History,
  Logout,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/common/Button";
import LoginModal from "@/components/auth/LoginModal";
import SearchBar from "@/components/common/SearchBar";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    router.push(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(0, 0, 0, 0)",
          backdropFilter: "blur(0px)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              {/* <MovieIcon sx={{ fontSize: 32, color: "#fff" }} /> */}
              <Image src="/streamlogonav.png" alt="logo" width={32} height={32} />
              <Box
                component="span"
                sx={{
                  fontSize: "24px",
                  fontWeight: 400,
                  color: "#fff",
                  fontFamily: "serif",
                }}
              >
                StreamSphere
              </Box>
            </Box>
          </Link>

          {/* Navigation Links & Search */}
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                Home
              </Box>
            </Link>

            <Link href="/movies" style={{ textDecoration: "none" }}>
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                Movies
              </Box>
            </Link>

            <Link href="/series" style={{ textDecoration: "none" }}>
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                Series
              </Box>
            </Link>

            {/* <Link href="/about" style={{ textDecoration: "none" }}>
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                About
              </Box>
            </Link> */}

            <SearchBar />
          </Box>

          {/* Auth Section */}
          {isAuthenticated ? (
            <>
              <Box
                onClick={handleClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#ffd700",
                    color: "#000",
                    width: 36,
                    height: 36,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  U
                </Avatar>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    bgcolor: "#1a1a1a",
                    color: "#fff",
                    minWidth: 200,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                    "& .MuiMenuItem-root": {
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "rgba(255, 215, 0, 0.1)",
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => handleNavigation("/profile")}>
                  <ListItemIcon>
                    <Person sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                <MenuItem onClick={() => handleNavigation("/watchlist")}>
                  <ListItemIcon>
                    <Bookmark sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  Watchlist
                </MenuItem>

                <MenuItem onClick={() => handleNavigation("/history")}>
                  <ListItemIcon>
                    <History sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  Watch History
                </MenuItem>

                <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout sx={{ color: "#e74c3c" }} />
                  </ListItemIcon>
                  <Typography sx={{ color: "#e74c3c" }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="primary"
              size="small"
              borderRadius="20px"
              textSize="12px"
              onClick={() => setLoginModalOpen(true)}
            >
              Start Streaming
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
