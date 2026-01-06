// backend/routes/watchlistRoutes.js
const mongoose = require("mongoose");
const { Watchlist } = require("../models/Watchlist"); // Import from model file
const requireLogin = require("../middleware/requireMail");

module.exports = (app) => {
  // Check if media is in watchlist
  app.get(
    "/api/v2/watchlist/check/:mediaId",
    requireLogin,
    async (req, res) => {
      try {
        const userId = req.user._id || req.user.id;
        const { mediaId } = req.params;

        const item = await Watchlist.findOne({ userId, mediaId });

        res.json({
          success: true,
          inWatchlist: !!item,
        });
      } catch (error) {
        console.error("Check watchlist error:", error);
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  );

  // Add to watchlist
  app.post("/api/v2/watchlist/:mediaId", requireLogin, async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;
      const { mediaId } = req.params;

      const item = await Watchlist.create({ userId, mediaId });

      res.json({
        success: true,
        message: "Added to watchlist",
        item,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Already in watchlist",
        });
      }
      console.error("Add to watchlist error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Remove from watchlist
  app.delete("/api/v2/watchlist/:mediaId", requireLogin, async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;
      const { mediaId } = req.params;

      await Watchlist.deleteOne({ userId, mediaId });

      res.json({
        success: true,
        message: "Removed from watchlist",
      });
    } catch (error) {
      console.error("Remove from watchlist error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Get user's watchlist
  app.get("/api/v2/watchlist", requireLogin, async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;

      console.log("Fetching watchlist for user:", userId);

      const items = await Watchlist.find({ userId })
        .populate({
          path: "mediaId",
          populate: { path: "genres", select: "name description" },
        })
        .sort({ addedAt: -1 });

      console.log("Found watchlist items:", items.length);
      console.log("Items:", items);

      // Filter out null mediaId (in case media was deleted)
      const watchlist = items
        .filter((item) => item.mediaId !== null)
        .map((item) => item.mediaId);

      console.log("Returning watchlist count:", watchlist.length);

      res.json({
        success: true,
        watchlist,
        count: watchlist.length,
      });
    } catch (error) {
      console.error("Get watchlist error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};
