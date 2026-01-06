// src/services/watchHistoryService.js

// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// API Request Helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const watchHistoryService = {
  // Get watch history with pagination (not implemented in backend yet)
  getWatchHistory: async (page = 1, limit = 50) => {
    try {
      // Return empty array since this endpoint doesn't exist yet
      return { success: true, watchHistory: [], total: 0, page: 1, pages: 0 };
    } catch (error) {
      throw error;
    }
  },

  // Add or update watch history
  updateWatchHistory: async (historyData) => {
    try {
      const data = await apiRequest("/api/v1/continue-Watching", {
        method: "POST",
        body: JSON.stringify({
          movieId: historyData.mediaId,
          lastTime: historyData.progress || 0,
        }),
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get continue watching list
  getContinueWatching: async () => {
    try {
      const data = await apiRequest("/api/v1/continue-Watching");
      return {
        success: true,
        continueWatching: data.continueWatchingList || [],
      };
    } catch (error) {
      throw error;
    }
  },

  // Remove from watch history (not implemented in backend yet)
  removeFromHistory: async (
    mediaId,
    seasonNumber = null,
    episodeNumber = null
  ) => {
    try {
      // Not implemented in backend yet
      return { success: true, message: "Remove not implemented yet" };
    } catch (error) {
      throw error;
    }
  },
};
