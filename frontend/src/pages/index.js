// src/pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, CircularProgress, Alert } from "@mui/material";
import HeroSlider from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import MediaCard from "@/components/common/MediaCard";
import Footer from "@/components/Footer";
import { mediaService } from "@/services/mediaService";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  // State for all content sections
  const [featuredContent, setFeaturedContent] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [thrillerContent, setThrillerContent] = useState([]);
  const [dramaContent, setDramaContent] = useState([]);
  const [sciFiContent, setSciFiContent] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch featured content for slider
        try {
          const featuredData = await mediaService.getFeaturedContent(5);
          setFeaturedContent(featuredData.data || []);
        } catch (err) {
          console.error("Error fetching featured content:", err);
        }

        // Fetch top rated movies
        try {
          const moviesData = await mediaService.getTopRatedMovies(10);
          setTopRatedMovies(moviesData.data || []);
        } catch (err) {
          console.error("Error fetching top rated movies:", err);
        }

        // Fetch top rated series
        try {
          const seriesData = await mediaService.getTopRatedSeries(10);
          setTopRatedSeries(seriesData.data || []);
        } catch (err) {
          console.error("Error fetching top rated series:", err);
        }

        // Fetch action movies
        try {
          const actionData = await mediaService.getMoviesByGenre("Action");
          setActionMovies(actionData.data || []);
        } catch (err) {
          console.error("Error fetching action movies:", err);
        }

        // Fetch thriller content
        try {
          const thrillerData = await mediaService.getMediaByGenre("Thriller");
          setThrillerContent(thrillerData.data || []);
        } catch (err) {
          console.error("Error fetching thriller content:", err);
        }

        // Fetch drama content
        try {
          const dramaData = await mediaService.getMediaByGenre("Drama");
          setDramaContent(dramaData.data || []);
        } catch (err) {
          console.error("Error fetching drama content:", err);
        }

        // Fetch sci-fi content
        try {
          const sciFiData = await mediaService.getMediaByGenre("Sci-Fi");
          setSciFiContent(sciFiData.data || []);
        } catch (err) {
          console.error("Error fetching sci-fi content:", err);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchContinueWatching = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/v1/continue-Watching", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success && data.continueWatchingList) {
            setContinueWatching(data.continueWatchingList);
          }
        } catch (error) {
          console.error("Error fetching continue watching:", error);
        }
      }
    };

    fetchContinueWatching();
  }, [isAuthenticated]);

  // Show loading state
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

  return (
    <>
      <Head>
        <title>StreamSphere - One Platform. Infinite Worlds.</title>
        <meta
          name="description"
          content="Watch movies, shows, and originals from across the globe"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/streamlogo.png" />
      </Head>

      {/* Error Alert */}
      {error && (
        <Box sx={{ p: 2, bgcolor: "#000" }}>
          <Alert severity="error" sx={{ maxWidth: "1200px", mx: "auto" }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Hero Slider */}
      <HeroSlider slides={featuredContent || []} />

      {/* Main Content - All Sections */}
      <Box
        sx={{
          mt: -14,
          position: "relative",
          zIndex: 10,
          bgcolor: "#000",
        }}
      >
        {/* Continue Watching */}
        {isAuthenticated && continueWatching && continueWatching.length > 0 && (
          <MediaRow title="Continue Watching">
            {continueWatching.map((item) => (
              <MediaCard
                key={`${item.media._id}-${item.seasonNumber || ""}-${
                  item.episodeNumber || ""
                }`}
                media={item.media}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Top Rated Movies */}
        {topRatedMovies && topRatedMovies.length > 0 && (
          <MediaRow title="Top Rated Movies">
            {topRatedMovies.map((movie) => (
              <MediaCard
                key={movie._id}
                media={movie}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Top Rated Series */}
        {topRatedSeries && topRatedSeries.length > 0 && (
          <MediaRow title="Top Rated Series">
            {topRatedSeries.map((series) => (
              <MediaCard
                key={series._id}
                media={series}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Action Movies */}
        {actionMovies && actionMovies.length > 0 && (
          <MediaRow title="Action Movies">
            {actionMovies.map((movie) => (
              <MediaCard
                key={movie._id}
                media={movie}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Thriller Content */}
        {thrillerContent && thrillerContent.length > 0 && (
          <MediaRow title="Thriller">
            {thrillerContent.map((item) => (
              <MediaCard
                key={item._id}
                media={item}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Drama Collection */}
        {dramaContent && dramaContent.length > 0 && (
          <MediaRow title="Drama">
            {dramaContent.map((item) => (
              <MediaCard
                key={item._id}
                media={item}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Sci-Fi Adventures */}
        {sciFiContent && sciFiContent.length > 0 && (
          <MediaRow title="Sci-Fi Adventures">
            {sciFiContent.map((item) => (
              <MediaCard
                key={item._id}
                media={item}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}
      </Box>

      <Footer />
    </>
  );
}
