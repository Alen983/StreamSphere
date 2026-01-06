// src/pages/series.js
import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, CircularProgress, Alert } from "@mui/material";
import HeroSlider from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import MediaCard from "@/components/common/MediaCard";
import Footer from "@/components/Footer";
import { mediaService } from "@/services/mediaService";
import { useAuth } from "@/context/AuthContext";

export default function Series() {
  const { isAuthenticated } = useAuth();

  // State for all series content sections
  const [featuredSeries, setFeaturedSeries] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [actionSeries, setActionSeries] = useState([]);
  const [thrillerSeries, setThrillerSeries] = useState([]);
  const [dramaSeries, setDramaSeries] = useState([]);
  const [sciFiSeries, setSciFiSeries] = useState([]);
  const [comedySeries, setComedySeries] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch featured series for slider (only series with sliderPosterUrl)
        try {
          const featuredData = await mediaService.getTopRatedSeries(10);
          const featured = (featuredData.data || []).filter(
            (item) => item.sliderPosterUrl && item.type === "series"
          );
          setFeaturedSeries(featured.slice(0, 5));
        } catch (err) {
          console.error("Error fetching featured series:", err);
        }

        // Fetch top rated series
        try {
          const seriesData = await mediaService.getTopRatedSeries(10);
          const series = (seriesData.data || []).filter(
            (item) => item.type === "series"
          );
          setTopRatedSeries(series);
        } catch (err) {
          console.error("Error fetching top rated series:", err);
        }

        // Fetch action series
        try {
          const actionData = await mediaService.getSeriesByGenre("Action");
          const series = (actionData.data || []).filter(
            (item) => item.type === "series"
          );
          setActionSeries(series);
        } catch (err) {
          console.error("Error fetching action series:", err);
        }

        // Fetch thriller series
        try {
          const thrillerData = await mediaService.getSeriesByGenre("Thriller");
          const series = (thrillerData.data || []).filter(
            (item) => item.type === "series"
          );
          setThrillerSeries(series);
        } catch (err) {
          console.error("Error fetching thriller series:", err);
        }

        // Fetch drama series
        try {
          const dramaData = await mediaService.getSeriesByGenre("Drama");
          const series = (dramaData.data || []).filter(
            (item) => item.type === "series"
          );
          setDramaSeries(series);
        } catch (err) {
          console.error("Error fetching drama series:", err);
        }

        // Fetch sci-fi series
        try {
          const sciFiData = await mediaService.getSeriesByGenre("Sci-Fi");
          const series = (sciFiData.data || []).filter(
            (item) => item.type === "series"
          );
          setSciFiSeries(series);
        } catch (err) {
          console.error("Error fetching sci-fi series:", err);
        }

        // Fetch comedy series
        try {
          const comedyData = await mediaService.getSeriesByGenre("Comedy");
          const series = (comedyData.data || []).filter(
            (item) => item.type === "series"
          );
          setComedySeries(series);
        } catch (err) {
          console.error("Error fetching comedy series:", err);
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
            // Filter only series from continue watching
            const seriesOnly = data.continueWatchingList.filter(
              (item) => item.media?.type === "series"
            );
            setContinueWatching(seriesOnly);
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
        <title>Series - StreamSphere</title>
        <meta
          name="description"
          content="Browse and watch the best TV series and shows on StreamSphere"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
      <HeroSlider slides={featuredSeries || []} />

      {/* Main Content - All Series Sections */}
      <Box
        sx={{
          mt: -14,
          position: "relative",
          zIndex: 10,
          bgcolor: "#000",
        }}
      >
        {/* Continue Watching - Series Only */}
        {isAuthenticated &&
          continueWatching &&
          continueWatching.length > 0 && (
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

        {/* Action Series */}
        {actionSeries && actionSeries.length > 0 && (
          <MediaRow title="Action Series">
            {actionSeries.map((series) => (
              <MediaCard
                key={series._id}
                media={series}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Thriller Series */}
        {thrillerSeries && thrillerSeries.length > 0 && (
          <MediaRow title="Thriller Series">
            {thrillerSeries.map((series) => (
              <MediaCard
                key={series._id}
                media={series}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Drama Series */}
        {dramaSeries && dramaSeries.length > 0 && (
          <MediaRow title="Drama Series">
            {dramaSeries.map((series) => (
              <MediaCard
                key={series._id}
                media={series}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Sci-Fi Series */}
        {sciFiSeries && sciFiSeries.length > 0 && (
          <MediaRow title="Sci-Fi Series">
            {sciFiSeries.map((series) => (
              <MediaCard
                key={series._id}
                media={series}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Comedy Series */}
        {comedySeries && comedySeries.length > 0 && (
          <MediaRow title="Comedy Series">
            {comedySeries.map((series) => (
              <MediaCard
                key={series._id}
                media={series}
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

