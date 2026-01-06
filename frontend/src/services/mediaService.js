const API_BASE_URL = "/api/v2";

export const mediaService = {
  // Get Single Media by ID
  getSingleMedia: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching media:", error);
      throw error;
    }
  },

  // Get Episodes for a Series
  getEpisodes: async (id, seasonNumber = null) => {
    try {
      const url = seasonNumber
        ? `${API_BASE_URL}/${id}/seasons/${seasonNumber}`
        : `${API_BASE_URL}/${id}/episodes`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching episodes:", error);
      throw error;
    }
  },

  // Get Top Rated Movies
  getTopRatedMovies: async (limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/top/rated?type=movie&limit=${limit}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
    }
  },

  // Get Top Rated Series
  getTopRatedSeries: async (limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/top/rated?type=series&limit=${limit}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching top rated series:", error);
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
      const response = await fetch(
        `${API_BASE_URL}?type=series&genre=${genre}`
      );
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

  // Get Featured/Slider Content (top rated with slider posters)
  getFeaturedContent: async (limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/top/rated?limit=${limit}`);
      const data = await response.json();
      // Filter items that have sliderPosterUrl
      const featured = data.data?.filter((item) => item.sliderPosterUrl) || [];
      return { success: true, data: featured };
    } catch (error) {
      console.error("Error fetching featured content:", error);
      throw error;
    }
  },
};
