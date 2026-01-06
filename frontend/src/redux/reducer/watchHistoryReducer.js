// src/redux/reducer/watchHistoryReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchHistory: [],
  continueWatching: [],
  totalHistory: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const watchHistorySlice = createSlice({
  name: "watchHistory",
  initialState,
  reducers: {
    // Set loading
    setWatchHistoryLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },

    // Set error
    setWatchHistoryError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearWatchHistoryError: (state) => {
      state.error = null;
    },

    // Set watch history
    setWatchHistory: (state, action) => {
      state.watchHistory = action.payload.watchHistory;
      state.totalHistory = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.pages;
      state.loading = false;
      state.error = null;
    },

    // Set continue watching
    setContinueWatching: (state, action) => {
      state.continueWatching = action.payload.continueWatching;
      state.loading = false;
      state.error = null;
    },

    // Add/Update watch history success
    updateWatchHistorySuccess: (state) => {
      state.loading = false;
      state.error = null;
    },

    // Remove from watch history success
    removeFromHistorySuccess: (state, action) => {
      state.watchHistory = state.watchHistory.filter(
        (item) => item.media._id !== action.payload.mediaId
      );
      state.continueWatching = state.continueWatching.filter(
        (item) => item.media._id !== action.payload.mediaId
      );
      state.loading = false;
      state.error = null;
    },

    // Clear watch history (on logout)
    clearWatchHistory: (state) => {
      state.watchHistory = [];
      state.continueWatching = [];
      state.totalHistory = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setWatchHistoryLoading,
  setWatchHistoryError,
  clearWatchHistoryError,
  setWatchHistory,
  setContinueWatching,
  updateWatchHistorySuccess,
  removeFromHistorySuccess,
  clearWatchHistory,
} = watchHistorySlice.actions;

export const watchHistoryReducer = watchHistorySlice.reducer;
