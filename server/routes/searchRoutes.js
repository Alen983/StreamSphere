const { Media } = require('../models/Media');

module.exports = (app) => {
  // Search media by title
  app.get('/api/v1/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    try {
        const results = await Media.find({ name: new RegExp(query, 'i') });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
    });
};

