// src/pages/watchlist.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { BookmarkBorder } from "@mui/icons-material";
import MediaCard from "@/components/common/MediaCard";
import { getWatchlist } from "@/redux/actions/watchlistActions";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function WatchlistPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Use separate selectors to ensure proper re-renders
  const watchlist = useSelector((state) => state.watchlist.watchlist);
  const loading = useSelector((state) => state.watchlist.loading);
  const error = useSelector((state) => state.watchlist.error);
  const watchlistCount = useSelector((state) => state.watchlist.watchlistCount);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Fetching watchlist...");
      dispatch(getWatchlist());
    }
  }, [dispatch, isAuthenticated]);

  // Listen for watchlist count changes
  useEffect(() => {
    console.log("Watchlist count changed:", watchlistCount);
  }, [watchlistCount]);

  // Log watchlist changes
  useEffect(() => {
    console.log("Watchlist data updated:", watchlist);
  }, [watchlist]);

  if (loading) {
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

  const itemCount = watchlist?.length || 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        pt: 12,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <BookmarkBorder sx={{ fontSize: 40, color: "#ffd700" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: "#fff",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              My Watchlist
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1.1rem",
            }}
          >
            {itemCount} {itemCount === 1 ? "item" : "items"} saved
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {itemCount === 0 && !loading && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
            }}
          >
            <BookmarkBorder
              sx={{
                fontSize: 100,
                color: "rgba(255, 255, 255, 0.2)",
                mb: 3,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                mb: 2,
                fontWeight: 500,
              }}
            >
              Your watchlist is empty
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mb: 4,
              }}
            >
              Start adding movies and series you want to watch later
            </Typography>
          </Box>
        )}

        {/* Watchlist Grid */}
        {itemCount > 0 && (
          <Grid
            container
            spacing={3}
            key={`grid-${itemCount}-${watchlist.map((m) => m._id).join("-")}`}
          >
            {watchlist.map((media) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={media._id}>
                <MediaCard media={media} showWatchlistButton={true} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default function WatchlistPageWrapper() {
  return (
    <ProtectedRoute>
      <WatchlistPage />
    </ProtectedRoute>
  );
}
