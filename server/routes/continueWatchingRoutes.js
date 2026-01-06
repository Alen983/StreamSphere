const mongoose = require("mongoose");
const ContinueWatching = mongoose.model("continueWatching");
const { Media } = require("../models/Media");
const requireLogin = require("../middleware/requireMail");

module.exports = (app) => {
  // SAVE OR UPDATE WATCH TIME
  app.post("/api/v1/continue-Watching", requireLogin, async (req, res) => {
    const userId = req.user._id || req.user.id; // Support both formats
    const { movieId, lastTime } = req.body;

    try {
      const record = await ContinueWatching.findOne({ userId, movieId });

      if (record) {
        // Update existing record
        record.lastTime = lastTime;
        await record.save();
        return res.status(200).json({
          message: "Watch time updated successfully",
          record,
        });
      }

      // Create new record
      const newRecord = await ContinueWatching.create({
        userId,
        movieId,
        lastTime,
      });

      res.status(201).json({
        message: "Watch time saved successfully",
        record: newRecord,
      });
    } catch (error) {
      console.error("Continue watching error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET CONTINUE WATCHING LIST WITH POPULATED MEDIA DATA
  app.get("/api/v1/continue-Watching", requireLogin, async (req, res) => {
    const userId = req.user._id || req.user.id; // Support both formats

    try {
      const continueWatchingList = await ContinueWatching.find({ userId });

      // Populate media data for each item
      const populatedList = await Promise.all(
        continueWatchingList.map(async (item) => {
          try {
            const media = await Media.findById(item.movieId).populate(
              "genres",
              "name description"
            );

            if (!media) {
              return null; // Skip if media not found
            }

            // Calculate progress percentage (assuming videos are typically 2 hours / 7200 seconds)
            const duration = media.duration ? media.duration * 60 : 7200; // Convert minutes to seconds or default
            const progress = Math.min(
              Math.round((item.lastTime / duration) * 100),
              100
            );

            return {
              media,
              lastTime: item.lastTime,
              progress,
              watchedAt: item.updatedAt || item.createdAt,
            };
          } catch (err) {
            console.error(`Error populating media ${item.movieId}:`, err);
            return null;
          }
        })
      );

      // Filter out null values (media that couldn't be found)
      const validList = populatedList.filter((item) => item !== null);

      res.status(200).json({
        success: true,
        continueWatchingList: validList,
      });
    } catch (error) {
      console.error("Get continue watching error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // DELETE FROM CONTINUE WATCHING (OPTIONAL - for user to remove items)
  app.delete(
    "/api/v1/continue-Watching/:movieId",
    requireLogin,
    async (req, res) => {
      const userId = req.user._id || req.user.id;
      const { movieId } = req.params;

      try {
        const result = await ContinueWatching.findOneAndDelete({
          userId,
          movieId,
        });

        if (!result) {
          return res.status(404).json({
            message: "Item not found in continue watching",
          });
        }

        res.status(200).json({
          message: "Removed from continue watching successfully",
        });
      } catch (error) {
        console.error("Delete continue watching error:", error);
        res.status(500).json({ message: error.message });
      }
    }
  );
};
