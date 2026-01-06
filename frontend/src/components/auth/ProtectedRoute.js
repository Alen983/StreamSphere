// src/components/auth/ProtectedRoute.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      if (!loading) {
        if (!isAuthenticated) {
          // Redirect to home page if not authenticated
          router.push("/");
        } else {
          setIsChecking(false);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking authentication
  if (loading || isChecking || !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#000",
        }}
      >
        <CircularProgress sx={{ color: "#ffd700" }} />
      </Box>
    );
  }

  // Render children if authenticated
  return children;
}
