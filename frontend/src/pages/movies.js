// src/pages/movies.js
import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, CircularProgress, Alert } from "@mui/material";
import HeroSlider from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import MediaCard from "@/components/common/MediaCard";
import Footer from "@/components/Footer";
import { mediaService } from "@/services/mediaService";
import { useAuth } from "@/context/AuthContext";

const GENRES = ["Action", "Thriller", "Drama", "Sci-Fi"];

export default function Movies() {
  const { isAuthenticated } = useAuth();

  const [featured, setFeatured] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const [topRatedRes, ...genreRes] = await Promise.all([
          mediaService.getTopRatedMovies(20),
          ...GENRES.map((g) => mediaService.getMoviesByGenre(g)),
        ]);

        const movies = topRatedRes.data || [];

        setFeatured(
          movies
            .filter((m) => m.type === "movie" && m.sliderPosterUrl)
            .slice(0, 5)
        );

        setTopRated(movies.slice(0, 10));

        const genreMap = {};
        GENRES.forEach((g, i) => {
          genreMap[g] = (genreRes[i].data || []).filter(
            (m) => m.type === "movie"
          );
        });
        setGenreMovies(genreMap);
      } catch {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Continue Watching
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchContinueWatching = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/v1/continue-Watching", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setContinueWatching(
            data.continueWatchingList.filter(
              (i) => i.media?.type === "movie"
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchContinueWatching();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="#000">
        <CircularProgress sx={{ color: "#ffd700" }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>StreamSphere – Movies</title>
        <meta name="description" content="Watch the best movies worldwide" />
      </Head>

      {error && (
        <Box p={2} bgcolor="#000">
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <HeroSlider slides={featured} />

      <Box mt={-14} bgcolor="#000" position="relative" zIndex={10}>
        {isAuthenticated && continueWatching.length > 0 && (
          <MediaRow title="Continue Watching">
            {continueWatching.map((i) => (
              <MediaCard key={i.media._id} media={i.media} />
            ))}
          </MediaRow>
        )}

        <MediaRow title="Top Rated Movies">
          {topRated.map((m) => (
            <MediaCard key={m._id} media={m} />
          ))}
        </MediaRow>

        {GENRES.map(
          (genre) =>
            genreMovies[genre]?.length > 0 && (
              <MediaRow key={genre} title={`${genre} Movies`}>
                {genreMovies[genre].map((m) => (
                  <MediaCard key={m._id} media={m} />
                ))}
              </MediaRow>
            )
        )}
      </Box>
      <Footer />
    </>
  );
}





