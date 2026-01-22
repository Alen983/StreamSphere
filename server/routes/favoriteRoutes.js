const mongoose = require("mongoose");
const User = mongoose.model("users");
const requireLogin = require("../middleware/requireMail");

module.exports = (app) => {
  // Toggle media in favorites
  app.post("/api/v1/favorites/:mediaId", requireLogin, async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;
      const { mediaId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Initialize preferences if they don't exist
      if (!user.preferences) {
        user.preferences = { favoriteMedia: [], favoriteGenres: [] };
      }

      const favoriteMedia = user.preferences.favoriteMedia || [];
      const index = favoriteMedia.indexOf(mediaId);

      let message = "";
      if (index === -1) {
        // Add to favorites
        user.preferences.favoriteMedia.push(mediaId);
        message = "Added to favorites";
      } else {
        // Remove from favorites
        user.preferences.favoriteMedia.splice(index, 1);
        message = "Removed from favorites";
      }

      await user.save();

      res.json({
        success: true,
        message,
        favorites: user.preferences.favoriteMedia,
      });
    } catch (error) {
      console.error("Toggle favorites error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Check if media is in favorites
  app.get(
    "/api/v1/favorites/check/:mediaId",
    requireLogin,
    async (req, res) => {
      try {
        const userId = req.user._id || req.user.id;
        const { mediaId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        const inFavorites =
          user.preferences?.favoriteMedia?.some(
            (id) => id.toString() === mediaId,
          ) || false;

        res.json({
          success: true,
          inFavorites,
        });
      } catch (error) {
        console.error("Check favorites error:", error);
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    },
  );
};
