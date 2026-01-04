import Head from 'next/head';
import Hero from '@/components/Hero';
import { mediaService } from '@/services/mediaService';
import { useEffect, useState } from 'react';
import MediaCard from '@/components/common/MediaCard';
import Footer from '@/components/Footer';
import MediaRow from '@/components/MediaRow';
import { Box } from '@mui/material';

export default function Home() {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [thrillerContent, setThrillerContent] = useState([]);
  const [dramaContent, setDramaContent] = useState([]);
  const [sciFiContent, setSciFiContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await mediaService.getTopRatedMovies(10);
        setTopRatedMovies(moviesData.data);

        const seriesData = await mediaService.getTopRatedSeries(10);
        setTopRatedSeries(seriesData.data);

        const actionData = await mediaService.getMoviesByGenre('Action');
        setActionMovies(actionData.data);

        const thrillerData = await mediaService.getMediaByGenre('Thriller');
        setThrillerContent(thrillerData.data);

        const dramaData = await mediaService.getMediaByGenre('Drama');
        setDramaContent(dramaData.data);

        const sciFiData = await mediaService.getMediaByGenre('Sci-Fi');
        setSciFiContent(sciFiData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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

      <Hero />

      {/* Main Content - All Sections */}
      <Box 
        sx={{ 
          mt: -14, 
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top Rated Movies */}
        <MediaRow title="Top Rated Movies">
          {topRatedMovies.map((movie) => (
            <MediaCard key={movie.id} media={movie} />
          ))}
        </MediaRow>

        {/* Top Rated Series */}
        <MediaRow title="Top Rated Series">
          {topRatedSeries.map((series) => (
            <MediaCard key={series.id} media={series} />
          ))}
        </MediaRow>

        {/* Action Movies */}
        <MediaRow title="Action Movies">
          {actionMovies.map((movie) => (
            <MediaCard key={movie.id} media={movie} />
          ))}
        </MediaRow>

        {/* Thriller Content */}
        <MediaRow title="Thriller">
          {thrillerContent.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </MediaRow>

        {/* Drama Collection */}
        <MediaRow title="Drama">
          {dramaContent.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </MediaRow>

        {/* Sci-Fi Adventures */}
        <MediaRow title="Sci-Fi Adventures">
          {sciFiContent.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </MediaRow>
      </Box>
      <Footer />
    </>
  );
}