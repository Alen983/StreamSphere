// src/pages/history.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import { History as HistoryIcon, PlayCircle } from "@mui/icons-material";
import MediaCard from "@/components/common/MediaCard";
import {
  getWatchHistory,
  getContinueWatching,
} from "@/redux/actions/watchHistoryActions";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function HistoryPage() {
  const dispatch = useDispatch();
  const { watchHistory, continueWatching, loading, error } = useSelector(
    (state) => state.watchHistory
  );
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWatchHistory());
      dispatch(getContinueWatching());
    }
  }, [dispatch, isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading && watchHistory.length === 0 && continueWatching.length === 0) {
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

  const displayData = tabValue === 0 ? continueWatching : watchHistory;

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
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <HistoryIcon sx={{ fontSize: 40, color: "#ffd700" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: "#fff",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Watch History
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            mb: 4,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                "&.Mui-selected": {
                  color: "#ffd700",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ffd700",
              },
            }}
          >
            <Tab
              label={`Continue Watching (${continueWatching.length})`}
              icon={<PlayCircle />}
              iconPosition="start"
            />
            <Tab
              label={`All History (${watchHistory.length})`}
              icon={<HistoryIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {displayData.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
            }}
          >
            <HistoryIcon
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
              {tabValue === 0
                ? "No items to continue watching"
                : "Your watch history is empty"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mb: 4,
              }}
            >
              {tabValue === 0
                ? "Start watching movies and series to see them here"
                : "Items you watch will appear here"}
            </Typography>
          </Box>
        )}

        {/* History Grid */}
        {displayData.length > 0 && (
          <Grid container spacing={3}>
            {displayData.map((item) => {
              const media = item.media;
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2.4}
                  key={`${media._id}-${item.seasonNumber}-${item.episodeNumber}`}
                >
                  <Box sx={{ position: "relative" }}>
                    <MediaCard media={media} showWatchlistButton={true} />

                    {/* Progress Bar */}
                    {item.progress > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          px: 1,
                          pb: 1,
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={item.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#e74c3c",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#fff",
                            fontSize: "0.7rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {item.progress}% watched
                          {item.seasonNumber && item.episodeNumber && (
                            <>
                              {" "}
                              • S{item.seasonNumber} E{item.episodeNumber}
                            </>
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default function HistoryPageWrapper() {
  return (
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  );
}
