// server/routes/videoRoutes.js
const mongoose = require("mongoose");
const { Media } = require("../models/Media");
const s3Service = require("../services/s3Service");
const requireLogin = require("../middleware/requireMail");

module.exports = (app) => {
  /**
   * GET /api/v1/video/signed-url/:mediaId
   * Get signed URL for a movie or series trailer/video
   */
  app.get(
    "/api/v1/video/signed-url/:mediaId",
    requireLogin,
    async (req, res) => {
      try {
        const { mediaId } = req.params;
        const { episodeId } = req.query;

        // Find media
        const media = await Media.findById(mediaId);
        if (!media) {
          return res.status(404).json({
            success: false,
            message: "Media not found",
          });
        }

        let videoUrl = null;
        let trailerUrl = null;

        // If it's a series and episodeId is provided, get episode video
        if (media.type === "series" && episodeId) {
          const episode = media.episodes.id(episodeId);
          if (!episode) {
            return res.status(404).json({
              success: false,
              message: "Episode not found",
            });
          }
          videoUrl = episode.videoUrl;
        } else {
          // For movies or series without episode specified
          videoUrl = media.videoUrl;
        }

        trailerUrl = media.trailerUrl;

        // Generate signed URLs if they are S3 URLs
        const response = {
          success: true,
          mediaId: media._id,
          type: media.type,
          name: media.name,
        };

        if (videoUrl && s3Service.isS3Url(videoUrl)) {
          const videoKey = s3Service.extractS3Key(videoUrl);
          response.videoUrl = await s3Service.getSignedVideoUrl(videoKey);
        } else {
          response.videoUrl = videoUrl;
        }

        if (trailerUrl && s3Service.isS3Url(trailerUrl)) {
          const trailerKey = s3Service.extractS3Key(trailerUrl);
          response.trailerUrl = await s3Service.getSignedVideoUrl(trailerKey);
        } else {
          response.trailerUrl = trailerUrl;
        }

        res.json(response);
      } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({
          success: false,
          message: error.message || "Failed to generate video URL",
        });
      }
    }
  );

  /**
   * GET /api/v1/video/episode-signed-url/:mediaId/:episodeId
   * Get signed URL for a specific episode
   */
  app.get(
    "/api/v1/video/episode-signed-url/:mediaId/:episodeId",
    requireLogin,
    async (req, res) => {
      try {
        const { mediaId, episodeId } = req.params;

        // Find media
        const media = await Media.findById(mediaId);
        if (!media) {
          return res.status(404).json({
            success: false,
            message: "Media not found",
          });
        }

        if (media.type !== "series") {
          return res.status(400).json({
            success: false,
            message: "This media is not a series",
          });
        }

        // Find episode
        const episode = media.episodes.id(episodeId);
        if (!episode) {
          return res.status(404).json({
            success: false,
            message: "Episode not found",
          });
        }

        // Generate signed URL
        let videoUrl = episode.videoUrl;
        let thumbnailUrl = episode.thumbnailUrl;

        if (videoUrl && s3Service.isS3Url(videoUrl)) {
          const videoKey = s3Service.extractS3Key(videoUrl);
          videoUrl = await s3Service.getSignedVideoUrl(videoKey);
        }

        if (thumbnailUrl && s3Service.isS3Url(thumbnailUrl)) {
          const thumbnailKey = s3Service.extractS3Key(thumbnailUrl);
          thumbnailUrl = await s3Service.getSignedImageUrl(thumbnailKey);
        }

        res.json({
          success: true,
          episode: {
            _id: episode._id,
            episodeNumber: episode.episodeNumber,
            seasonNumber: episode.seasonNumber,
            title: episode.title,
            description: episode.description,
            duration: episode.duration,
            videoUrl,
            thumbnailUrl,
            rating: episode.rating,
          },
        });
      } catch (error) {
        console.error("Error generating episode signed URL:", error);
        res.status(500).json({
          success: false,
          message: error.message || "Failed to generate episode video URL",
        });
      }
    }
  );

  /**
   * GET /api/v1/video/season-urls/:mediaId/:seasonNumber
   * Get signed URLs for all episodes in a season
   */
  app.get(
    "/api/v1/video/season-urls/:mediaId/:seasonNumber",
    requireLogin,
    async (req, res) => {
      try {
        const { mediaId, seasonNumber } = req.params;

        // Find media
        const media = await Media.findById(mediaId);
        if (!media) {
          return res.status(404).json({
            success: false,
            message: "Media not found",
          });
        }

        if (media.type !== "series") {
          return res.status(400).json({
            success: false,
            message: "This media is not a series",
          });
        }

        // Get episodes for this season
        const episodes = media.episodes.filter(
          (ep) => ep.seasonNumber === parseInt(seasonNumber)
        );

        if (episodes.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No episodes found for this season",
          });
        }

        // Generate signed URLs for all episodes
        const episodesWithUrls = await Promise.all(
          episodes.map(async (episode) => {
            let videoUrl = episode.videoUrl;
            let thumbnailUrl = episode.thumbnailUrl;

            if (videoUrl && s3Service.isS3Url(videoUrl)) {
              const videoKey = s3Service.extractS3Key(videoUrl);
              videoUrl = await s3Service.getSignedVideoUrl(videoKey);
            }

            if (thumbnailUrl && s3Service.isS3Url(thumbnailUrl)) {
              const thumbnailKey = s3Service.extractS3Key(thumbnailUrl);
              thumbnailUrl = await s3Service.getSignedImageUrl(thumbnailKey);
            }

            return {
              _id: episode._id,
              episodeNumber: episode.episodeNumber,
              seasonNumber: episode.seasonNumber,
              title: episode.title,
              description: episode.description,
              duration: episode.duration,
              videoUrl,
              thumbnailUrl,
              rating: episode.rating,
            };
          })
        );

        res.json({
          success: true,
          seasonNumber: parseInt(seasonNumber),
          episodes: episodesWithUrls,
        });
      } catch (error) {
        console.error("Error generating season URLs:", error);
        res.status(500).json({
          success: false,
          message: error.message || "Failed to generate season video URLs",
        });
      }
    }
  );
};
