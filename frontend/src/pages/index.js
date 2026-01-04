// src/pages/index.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { Box } from "@mui/material";
import HeroSlider from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import MediaCard from "@/components/common/MediaCard";
import Footer from "@/components/Footer";
import { mediaService } from "@/services/mediaService";
import { getContinueWatching } from "@/redux/actions/watchHistoryActions";

export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { continueWatching } = useSelector((state) => state.watchHistory);

  const [featuredContent, setFeaturedContent] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [thrillerContent, setThrillerContent] = useState([]);
  const [dramaContent, setDramaContent] = useState([]);
  const [sciFiContent, setSciFiContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured content for slider
        const featuredData = await mediaService.getFeaturedContent(5);
        setFeaturedContent(featuredData.data);

        const moviesData = await mediaService.getTopRatedMovies(10);
        setTopRatedMovies(moviesData.data);

        const seriesData = await mediaService.getTopRatedSeries(10);
        setTopRatedSeries(seriesData.data);

        const actionData = await mediaService.getMoviesByGenre("Action");
        setActionMovies(actionData.data);

        const thrillerData = await mediaService.getMediaByGenre("Thriller");
        setThrillerContent(thrillerData.data);

        const dramaData = await mediaService.getMediaByGenre("Drama");
        setDramaContent(dramaData.data);

        const sciFiData = await mediaService.getMediaByGenre("Sci-Fi");
        setSciFiContent(sciFiData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getContinueWatching());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Head>
        <title>StreamSphere - One Platform. Infinite Worlds.</title>
        <meta
          name="description"
          content="Watch movies, shows, and originals from across the globe"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Slider */}
      <HeroSlider slides={featuredContent} />

      {/* Main Content - All Sections */}
      <Box
        sx={{
          mt: -14,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Continue Watching */}
        {isAuthenticated && continueWatching.length > 0 && (
          <MediaRow title="Continue Watching">
            {continueWatching.map((item) => (
              <MediaCard
                key={`${item.media._id}-${item.seasonNumber}-${item.episodeNumber}`}
                media={item.media}
                showWatchlistButton={true}
              />
            ))}
          </MediaRow>
        )}

        {/* Top Rated Movies */}
        <MediaRow title="Top Rated Movies">
          {topRatedMovies.map((movie) => (
            <MediaCard
              key={movie._id}
              media={movie}
              showWatchlistButton={true}
            />
          ))}
        </MediaRow>

        {/* Top Rated Series */}
        <MediaRow title="Top Rated Series">
          {topRatedSeries.map((series) => (
            <MediaCard
              key={series._id}
              media={series}
              showWatchlistButton={true}
            />
          ))}
        </MediaRow>

        {/* Action Movies */}
        <MediaRow title="Action Movies">
          {actionMovies.map((movie) => (
            <MediaCard
              key={movie._id}
              media={movie}
              showWatchlistButton={true}
            />
          ))}
        </MediaRow>

        {/* Thriller Content */}
        <MediaRow title="Thriller">
          {thrillerContent.map((item) => (
            <MediaCard key={item._id} media={item} showWatchlistButton={true} />
          ))}
        </MediaRow>

        {/* Drama Collection */}
        <MediaRow title="Drama">
          {dramaContent.map((item) => (
            <MediaCard key={item._id} media={item} showWatchlistButton={true} />
          ))}
        </MediaRow>

        {/* Sci-Fi Adventures */}
        <MediaRow title="Sci-Fi Adventures">
          {sciFiContent.map((item) => (
            <MediaCard key={item._id} media={item} showWatchlistButton={true} />
          ))}
        </MediaRow>
      </Box>
      <Footer />
    </>
  );
}
