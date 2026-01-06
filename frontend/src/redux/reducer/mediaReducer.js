import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topRatedMovies: [],
  topRatedSeries: [],
  actionMovies: [],
  thrillerSeries: [],
  dramaContent: [],
  sciFiContent: [],
  loading: false,
  error: null,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload;
    },
    setTopRatedSeries: (state, action) => {
      state.topRatedSeries = action.payload;
    },
    setActionMovies: (state, action) => {
      state.actionMovies = action.payload;
    },
    setThrillerSeries: (state, action) => {
      state.thrillerSeries = action.payload;
    },
    setDramaContent: (state, action) => {
      state.dramaContent = action.payload;
    },
    setSciFiContent: (state, action) => {
      state.sciFiContent = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTopRatedMovies,
  setTopRatedSeries,
  setActionMovies,
  setThrillerSeries,
  setDramaContent,
  setSciFiContent,
  setLoading,
  setError,
} = mediaSlice.actions;

export const mediaReducer = mediaSlice.reducer;
