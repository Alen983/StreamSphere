// src/redux/reducer/watchlistReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist: [],
  watchlistCount: 0,
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    // Set loading
    setWatchlistLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
        error: null,
      };
    },

    // Set error
    setWatchlistError: (state, action) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    },

    // Clear error
    clearWatchlistError: (state) => {
      return {
        ...state,
        error: null,
      };
    },

    // Set watchlist - RETURN NEW STATE OBJECT
    setWatchlist: (state, action) => {
      console.log("setWatchlist reducer called with:", action.payload);
      const newWatchlist = action.payload.watchlist || [];
      console.log("New watchlist state:", newWatchlist);

      return {
        ...state,
        watchlist: newWatchlist,
        watchlistCount: action.payload.count || newWatchlist.length,
        loading: false,
        error: null,
      };
    },

    // Add to watchlist
    addToWatchlistSuccess: (state, action) => {
      return {
        ...state,
        watchlistCount: action.payload.watchlistCount,
        loading: false,
        error: null,
      };
    },

    // Remove from watchlist
    removeFromWatchlistSuccess: (state, action) => {
      console.log("Removing from watchlist:", action.payload.mediaId);
      console.log("Current watchlist:", state.watchlist);

      const newWatchlist = state.watchlist.filter((item) => {
        console.log("Comparing:", item._id, "vs", action.payload.mediaId);
        return item._id !== action.payload.mediaId;
      });

      console.log("New watchlist after filter:", newWatchlist);

      return {
        ...state,
        watchlist: newWatchlist,
        watchlistCount: newWatchlist.length,
        loading: false,
        error: null,
      };
    },

    // Clear watchlist (on logout)
    clearWatchlist: () => {
      return {
        watchlist: [],
        watchlistCount: 0,
        loading: false,
        error: null,
      };
    },
  },
});

export const {
  setWatchlistLoading,
  setWatchlistError,
  clearWatchlistError,
  setWatchlist,
  addToWatchlistSuccess,
  removeFromWatchlistSuccess,
  clearWatchlist,
} = watchlistSlice.actions;

export const watchlistReducer = watchlistSlice.reducer;
