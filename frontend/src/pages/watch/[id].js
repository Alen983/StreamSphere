// src/pages/watch/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import VideoPlayer from "@/components/player/videoPlayer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { mediaService } from "@/services/mediaService";
import api from "@/lib/api";

function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  // Media state
  const [media, setMedia] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Series state
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  // Continue watching state
  const [initialTime, setInitialTime] = useState(0);

  // Fetch media details
  useEffect(() => {
    if (!id) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get media details
        const mediaData = await mediaService.getSingleMedia(id);
        if (!mediaData.success) {
          throw new Error("Media not found");
        }

        setMedia(mediaData.data);

        // If it's a series, get episodes
        if (mediaData.data.type === "series") {
          const episodesData = await mediaService.getEpisodes(id);
          if (episodesData.success) {
            // Get unique seasons
            const uniqueSeasons = [
              ...new Set(episodesData.data.map((ep) => ep.seasonNumber)),
            ].sort((a, b) => a - b);
            setSeasons(uniqueSeasons);

            // Set episodes for first season
            const season1Episodes = episodesData.data.filter(
              (ep) => ep.seasonNumber === 1
            );
            setEpisodes(season1Episodes);

            // Auto-select first episode
            if (season1Episodes.length > 0) {
              setSelectedEpisode(season1Episodes[0]);
              await loadEpisodeVideo(season1Episodes[0]._id);
            }
          }
        } else {
          // For movies, load video directly
          await loadMovieVideo(id);
        }

        // Check for continue watching progress
        await checkContinueWatching(id);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError(err.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id]);

  // Load movie video URL
  const loadMovieVideo = async (mediaId) => {
    try {
      const response = await api.get(`/api/v1/video/signed-url/${mediaId}`);
      if (response.data.success && response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
      } else {
        throw new Error("Video URL not available");
      }
    } catch (err) {
      console.error("Error loading movie video:", err);
      setError("Failed to load video");
    }
  };

  // Load episode video URL
  const loadEpisodeVideo = async (episodeId) => {
    try {
      const response = await api.get(
        `/api/v1/video/episode-signed-url/${id}/${episodeId}`
      );
      if (response.data.success && response.data.episode.videoUrl) {
        setVideoUrl(response.data.episode.videoUrl);
      } else {
        throw new Error("Episode video URL not available");
      }
    } catch (err) {
      console.error("Error loading episode video:", err);
      setError("Failed to load episode video");
    }
  };

  // Check continue watching progress
  const checkContinueWatching = async (mediaId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/continue-Watching", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success && data.continueWatchingList) {
        const item = data.continueWatchingList.find(
          (item) => item.media._id === mediaId
        );
        if (item && item.lastTime) {
          setInitialTime(item.lastTime);
        }
      }
    } catch (err) {
      console.error("Error checking continue watching:", err);
    }
  };

  // Handle season change
  const handleSeasonChange = async (event, newSeason) => {
    setSelectedSeason(newSeason);
    try {
      const episodesData = await mediaService.getEpisodes(id, newSeason);
      if (episodesData.success) {
        setEpisodes(episodesData.data.episodes);
        if (episodesData.data.episodes.length > 0) {
          const firstEp = episodesData.data.episodes[0];
          setSelectedEpisode(firstEp);
          await loadEpisodeVideo(firstEp._id);
        }
      }
    } catch (err) {
      console.error("Error loading season episodes:", err);
    }
  };

  // Handle episode selection
  const handleEpisodeSelect = async (episode) => {
    setSelectedEpisode(episode);
    await loadEpisodeVideo(episode._id);
    setInitialTime(0); // Reset time for new episode
  };

  // Handle progress tracking
  const handleProgress = async (currentTime) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/v1/continue-Watching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: id,
          lastTime: currentTime,
        }),
      });
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    // Auto-play next episode for series
    if (media?.type === "series" && selectedEpisode) {
      const currentIndex = episodes.findIndex(
        (ep) => ep._id === selectedEpisode._id
      );
      if (currentIndex < episodes.length - 1) {
        handleEpisodeSelect(episodes[currentIndex + 1]);
      }
    }
  };

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

  if (error || !media) {
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
        <Container maxWidth="sm">
          <Alert severity="error">{error || "Media not found"}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        pt: 8,
      }}
    >
      {/* Video Player */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "50vh", md: "80vh" },
          backgroundColor: "#000",
        }}
      >
        {videoUrl ? (
          <VideoPlayer
            videoUrl={videoUrl}
            posterUrl={media.posterUrl}
            onProgress={handleProgress}
            initialTime={initialTime}
            onEnded={handleVideoEnd}
            autoPlay={true}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#fff" }}>Loading video...</Typography>
          </Box>
        )}
      </Box>

      {/* Media Information */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Title and Details */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {media.name}
            {media.type === "series" && selectedEpisode && (
              <Typography
                component="span"
                sx={{ color: "#ffd700", ml: 2, fontSize: "1.2rem" }}
              >
                S{selectedEpisode.seasonNumber}:E{selectedEpisode.episodeNumber}{" "}
                - {selectedEpisode.title}
              </Typography>
            )}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              {new Date(media.releaseDate).getFullYear()}
            </Typography>
            {media.duration && (
              <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {media.duration} min
              </Typography>
            )}
            {media.rating && (
              <Typography sx={{ color: "#ffd700" }}>
                ⭐ {media.rating}
              </Typography>
            )}
          </Box>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1rem",
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {media.description}
          </Typography>

          {media.genres && media.genres.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {media.genres.map((genre) => (
                <Box
                  key={genre._id}
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: "rgba(255, 215, 0, 0.2)",
                    borderRadius: 1,
                    color: "#ffd700",
                    fontSize: "0.875rem",
                  }}
                >
                  {genre.name}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Episodes (for series) */}
        {media.type === "series" && seasons.length > 0 && (
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: 600,
                mb: 3,
              }}
            >
              Episodes
            </Typography>

            {/* Season Tabs */}
            <Tabs
              value={selectedSeason}
              onChange={handleSeasonChange}
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                  "&.Mui-selected": {
                    color: "#ffd700",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#ffd700",
                },
              }}
            >
              {seasons.map((season) => (
                <Tab key={season} label={`Season ${season}`} value={season} />
              ))}
            </Tabs>

            {/* Episode Grid */}
            <Grid container spacing={2}>
              {episodes.map((episode) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={episode._id}>
                  <Card
                    onClick={() => handleEpisodeSelect(episode)}
                    sx={{
                      backgroundColor: "#1a1a1a",
                      cursor: "pointer",
                      border:
                        selectedEpisode?._id === episode._id
                          ? "2px solid #ffd700"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={episode.thumbnailUrl || media.posterUrl}
                        alt={episode.title}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <PlayArrow
                          sx={{
                            fontSize: 50,
                            color: "#fff",
                            opacity: 0.8,
                          }}
                        />
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ffd700", mb: 0.5 }}
                      >
                        Episode {episode.episodeNumber}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {episode.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {episode.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          display: "block",
                          mt: 1,
                        }}
                      >
                        {episode.duration} min
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default function WatchPageWrapper() {
  return (
    <ProtectedRoute>
      <WatchPage />
    </ProtectedRoute>
  );
}
