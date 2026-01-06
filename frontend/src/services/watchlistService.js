// src/services/watchlistService.js

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

  console.log("API Request:", endpoint, config); // ADD THIS LOG

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();

    console.log("API Response:", response.status, data); // ADD THIS LOG

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const watchlistService = {
  // Get user's watchlist
  getWatchlist: async () => {
    try {
      console.log("Calling getWatchlist service"); // ADD THIS LOG
      const data = await apiRequest("/api/v2/watchlist");
      console.log("Watchlist service response:", data); // ADD THIS LOG
      return data;
    } catch (error) {
      console.error("Watchlist service error:", error);
      throw error;
    }
  },

  // Add to watchlist
  addToWatchlist: async (mediaId) => {
    try {
      const data = await apiRequest(`/api/v2/watchlist/${mediaId}`, {
        method: "POST",
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Remove from watchlist
  removeFromWatchlist: async (mediaId) => {
    try {
      const data = await apiRequest(`/api/v2/watchlist/${mediaId}`, {
        method: "DELETE",
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Check if in watchlist
  checkInWatchlist: async (mediaId) => {
    try {
      const data = await apiRequest(`/api/v2/watchlist/check/${mediaId}`);
      return { success: true, inWatchlist: data.inWatchlist };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
