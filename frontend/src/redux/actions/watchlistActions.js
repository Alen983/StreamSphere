// src/redux/actions/watchlistActions.js
import { watchlistService } from "@/services/watchlistService";
import {
  setWatchlistLoading,
  setWatchlistError,
  setWatchlist,
  addToWatchlistSuccess,
  removeFromWatchlistSuccess,
  clearWatchlistError,
} from "../reducer/watchlistReducer";

// Get watchlist
export const getWatchlist = () => async (dispatch) => {
  try {
    dispatch(setWatchlistLoading(true));
    console.log("getWatchlist action called");
    const data = await watchlistService.getWatchlist();
    console.log("getWatchlist received data:", data);

    dispatch(
      setWatchlist({
        watchlist: data.watchlist || [],
        count: data.count || 0,
      })
    );

    return { success: true, data };
  } catch (error) {
    console.error("getWatchlist error:", error);
    dispatch(setWatchlistError(error.message));
    return { success: false, error: error.message };
  }
};

// Add to watchlist
export const addToWatchlist = (mediaId) => async (dispatch) => {
  try {
    dispatch(setWatchlistLoading(true));
    const data = await watchlistService.addToWatchlist(mediaId);

    // Refresh watchlist immediately
    const result = await dispatch(getWatchlist());

    return { success: true, data };
  } catch (error) {
    dispatch(setWatchlistError(error.message));
    return { success: false, error: error.message };
  }
};

// Remove from watchlist
export const removeFromWatchlist = (mediaId) => async (dispatch) => {
  try {
    console.log("removeFromWatchlist called for:", mediaId);
    dispatch(setWatchlistLoading(true));

    const data = await watchlistService.removeFromWatchlist(mediaId);
    console.log("Remove API response:", data);

    // Clear any errors first
    dispatch(clearWatchlistError());

    // Force refresh the entire watchlist from backend
    const result = await dispatch(getWatchlist());
    console.log("Watchlist refreshed after removal:", result);

    return { success: true, data };
  } catch (error) {
    console.error("removeFromWatchlist error:", error);
    dispatch(setWatchlistError(error.message));
    return { success: false, error: error.message };
  }
};

// Check if in watchlist
export const checkInWatchlist = (mediaId) => async () => {
  try {
    const data = await watchlistService.checkInWatchlist(mediaId);
    return { success: true, inWatchlist: data.inWatchlist };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
