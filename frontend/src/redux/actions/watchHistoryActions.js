// src/redux/actions/watchHistoryActions.js
import { watchHistoryService } from "@/services/watchHistoryService";
import {
  setWatchHistoryLoading,
  setWatchHistoryError,
  setWatchHistory,
  setContinueWatching,
  updateWatchHistorySuccess,
  removeFromHistorySuccess,
} from "../reducer/watchHistoryReducer";

// Get watch history
export const getWatchHistory =
  (page = 1, limit = 50) =>
  async (dispatch) => {
    try {
      dispatch(setWatchHistoryLoading(true));
      const data = await watchHistoryService.getWatchHistory(page, limit);

      dispatch(
        setWatchHistory({
          watchHistory: data.watchHistory,
          total: data.total,
          page: data.page,
          pages: data.pages,
        })
      );

      return { success: true, data };
    } catch (error) {
      dispatch(setWatchHistoryError(error.message));
      return { success: false, error: error.message };
    }
  };

// Update watch history
export const updateWatchHistory = (historyData) => async (dispatch) => {
  try {
    dispatch(setWatchHistoryLoading(true));
    const data = await watchHistoryService.updateWatchHistory(historyData);

    dispatch(updateWatchHistorySuccess());

    return { success: true, data };
  } catch (error) {
    dispatch(setWatchHistoryError(error.message));
    return { success: false, error: error.message };
  }
};

// Get continue watching
export const getContinueWatching = () => async (dispatch) => {
  try {
    dispatch(setWatchHistoryLoading(true));
    const data = await watchHistoryService.getContinueWatching();

    dispatch(
      setContinueWatching({
        continueWatching: data.continueWatching,
      })
    );

    return { success: true, data };
  } catch (error) {
    dispatch(setWatchHistoryError(error.message));
    return { success: false, error: error.message };
  }
};

// Remove from watch history
export const removeFromHistory =
  (mediaId, seasonNumber = null, episodeNumber = null) =>
  async (dispatch) => {
    try {
      dispatch(setWatchHistoryLoading(true));
      const data = await watchHistoryService.removeFromHistory(
        mediaId,
        seasonNumber,
        episodeNumber
      );

      dispatch(removeFromHistorySuccess({ mediaId }));

      return { success: true, data };
    } catch (error) {
      dispatch(setWatchHistoryError(error.message));
      return { success: false, error: error.message };
    }
  };
