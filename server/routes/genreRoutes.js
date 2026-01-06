const mongoose = require("mongoose");
const { Genre } = require("../models/Genre");

module.exports = (app) => {
  // Create a new genre
  app.post("/api/v1/genre/add", async (req, res) => {
    try {
      const { name, description, isActive } = req.body;

      // Check if genre already exists
      const existingGenre = await Genre.findOne({ name: name.toLowerCase() });
      if (existingGenre) {
        return res.status(400).json({ message: "Genre already exists" });
      }

      const genre = await Genre.create({
        name: name.toLowerCase(),
        description,
        isActive,
      });

      res.status(201).json({
        message: "Genre created successfully",
        genre,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get all genres
  app.get("/api/v1/genre/all", async (req, res) => {
    try {
      const genres = await Genre.find({ isActive: true }).sort({ name: 1 });

      res.status(200).json({
        message: "Genres retrieved successfully",
        count: genres.length,
        genres,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get genre by ID
  app.get("/api/v1/genre/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const genre = await Genre.findById(id);

      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }

      res.status(200).json({
        message: "Genre retrieved successfully",
        genre,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update genre
  app.put("/api/v1/genre/update/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;

      const updateData = {};
      if (name) updateData.name = name.toLowerCase();
      if (description !== undefined) updateData.description = description;
      if (isActive !== undefined) updateData.isActive = isActive;

      const genre = await Genre.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }

      res.status(200).json({
        message: "Genre updated successfully",
        genre,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delete genre (soft delete by setting isActive to false)
  app.delete("/api/v1/genre/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const genre = await Genre.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }

      res.status(200).json({
        message: "Genre deleted successfully",
        genre,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Hard delete genre (permanent deletion)
  app.delete("/api/v1/genre/hard-delete/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const genre = await Genre.findByIdAndDelete(id);

      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }

      res.status(200).json({
        message: "Genre permanently deleted",
        genre,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Search genres by name
  app.get("/api/v1/genre/search/:query", async (req, res) => {
    try {
      const { query } = req.params;

      const genres = await Genre.find({
        name: { $regex: query, $options: "i" },
        isActive: true,
      }).sort({ name: 1 });

      res.status(200).json({
        message: "Search results",
        count: genres.length,
        genres,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};
