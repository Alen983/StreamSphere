const API_BASE_URL = '/api/v2';

export const mediaService = {
  // Get Top Rated Movies
  getTopRatedMovies: async (limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/top/rated?type=movie&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Get Top Rated Series
  getTopRatedSeries: async (limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/top/rated?type=series&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching top rated series:', error);
      throw error;
    }
  },

  // Get Movies by Genre
  getMoviesByGenre: async (genre) => {
    try {
      const response = await fetch(`${API_BASE_URL}/genre/${genre}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${genre} movies:`, error);
      throw error;
    }
  },

  // Get Series by Genre
  getSeriesByGenre: async (genre) => {
    try {
      const response = await fetch(`${API_BASE_URL}?type=series&genre=${genre}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${genre} series:`, error);
      throw error;
    }
  },

  // Get Media by Genre (Both Movies & Series)
  getMediaByGenre: async (genre) => {
    try {
      const response = await fetch(`${API_BASE_URL}/genre/${genre}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${genre} content:`, error);
      throw error;
    }
  },
};