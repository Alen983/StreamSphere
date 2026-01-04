const express = require('express');
const router = express.Router();
const { Media } = require('../models/Media');

// ===== MEDIA CRUD OPERATIONS =====

// GET all media with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      type,
      genre,
      language,
      minRating,
      maxRating,
      country,
      ageRating,
      search,
      sortBy = 'releaseDate',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (genre) filter.genres = genre;
    if (language) filter.languages = language;
    if (country) filter.country = country;
    if (ageRating) filter.ageRating = ageRating;
    
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = parseFloat(minRating);
      if (maxRating) filter.rating.$lte = parseFloat(maxRating);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const media = await Media.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Media.countDocuments(filter);

    res.json({
      success: true,
      data: media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching media',
      error: error.message
    });
  }
});

// GET single media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching media',
      error: error.message
    });
  }
});

// POST create new media
router.post('/add/media', async (req, res) => {
  try {
    const media = new Media(req.body);
    await media.save();
    
    res.status(201).json({
      success: true,
      message: 'Media created successfully',
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating media',
      error: error.message
    });
  }
});

// PUT update media
router.put('/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      message: 'Media updated successfully',
      data: media
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating media',
      error: error.message
    });
  }
});

// DELETE media
router.delete('/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting media',
      error: error.message
    });
  }
});

// ===== EPISODE MANAGEMENT (FOR SERIES) =====

// GET all episodes for a series
router.get('/:id/episodes', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    if (media.type !== 'series') {
      return res.status(400).json({
        success: false,
        message: 'This media is not a series'
      });
    }

    const { season } = req.query;
    let episodes = media.episodes;

    if (season) {
      episodes = episodes.filter(ep => ep.seasonNumber === parseInt(season));
    }

    res.json({
      success: true,
      data: episodes,
      totalSeasons: media.totalSeasons,
      totalEpisodes: media.totalEpisodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching episodes',
      error: error.message
    });
  }
});

// GET single episode
router.get('/:id/episodes/:episodeId', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    const episode = media.episodes.id(req.params.episodeId);
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found'
      });
    }

    res.json({
      success: true,
      data: episode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching episode',
      error: error.message
    });
  }
});

// POST add episode to series
router.post('/:id/episodes', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    if (media.type !== 'series') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add episodes to a movie'
      });
    }

    media.episodes.push(req.body);
    await media.save();

    const newEpisode = media.episodes[media.episodes.length - 1];

    res.status(201).json({
      success: true,
      message: 'Episode added successfully',
      data: newEpisode
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding episode',
      error: error.message
    });
  }
});

// PUT update episode
router.put('/:id/episodes/:episodeId', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    const episode = media.episodes.id(req.params.episodeId);
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found'
      });
    }

    // Update episode fields
    Object.keys(req.body).forEach(key => {
      episode[key] = req.body[key];
    });

    await media.save();

    res.json({
      success: true,
      message: 'Episode updated successfully',
      data: episode
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating episode',
      error: error.message
    });
  }
});

// DELETE episode
router.delete('/:id/episodes/:episodeId', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    const episode = media.episodes.id(req.params.episodeId);
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found'
      });
    }

    episode.deleteOne();
    await media.save();

    res.json({
      success: true,
      message: 'Episode deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting episode',
      error: error.message
    });
  }
});

// ===== UTILITY ROUTES =====

// GET media by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const media = await Media.find({ genres: req.params.genre })
      .sort({ rating: -1 })
      .limit(20);

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching media by genre',
      error: error.message
    });
  }
});

// GET trending media (highest rated recent releases)
router.get('/trending/all', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const media = await Media.find({
      releaseDate: { $gte: thirtyDaysAgo }
    })
      .sort({ rating: -1 })
      .limit(10);

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending media',
      error: error.message
    });
  }
});

// GET top rated media
router.get('/top/rated', async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    const filter = type ? { type } : {};

    const media = await Media.find(filter)
      .sort({ rating: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top rated media',
      error: error.message
    });
  }
});

// GET season episodes grouped
router.get('/:id/seasons/:seasonNumber', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    if (media.type !== 'series') {
      return res.status(400).json({
        success: false,
        message: 'This media is not a series'
      });
    }

    const seasonNumber = parseInt(req.params.seasonNumber);
    const episodes = media.episodes
      .filter(ep => ep.seasonNumber === seasonNumber)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);

    if (episodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Season not found'
      });
    }

    res.json({
      success: true,
      data: {
        seasonNumber,
        episodes,
        totalEpisodes: episodes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching season episodes',
      error: error.message
    });
  }
});

module.exports = (app) => {
  app.use('/api/v2', router);
};