const { configureStore } = require("@reduxjs/toolkit");
import { themeReducer } from "./reducer/themeReducer";
import { mediaReducer } from "./reducer/mediaReducer";
import { watchlistReducer } from "./reducer/watchlistReducer";
import { watchHistoryReducer } from "./reducer/watchHistoryReducer";

export const store = configureStore({
  reducer: {
    activeTheme: themeReducer,
    media: mediaReducer,
    watchlist: watchlistReducer,
    watchHistory: watchHistoryReducer,
  },
});
