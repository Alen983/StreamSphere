const mongoose = require("mongoose");
const Movie = mongoose.model("movies");

module.exports = (app) => {
    app.post("/api/v1/movie/add", async (req, res) => {
    console.log("ADD NEW MOVIE");
    const { title, genre, language, duration,tags,release_date,poster_url, trailer_url,movie_url } = req.body;

    try {
      const movie = await Movie.findOne({ title });

      if (movie) {
        return res.status(400).json({ message: "Movie already exists" });
      }

      movieFields = { title, genre, language, duration,tags,release_date,poster_url, trailer_url,movie_url };
      const response = await Movie.create(movieFields);

      res.status(201).json({ message: "Movie added successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
  app.get("/api/v1/movie/all/get", async (req, res) => {
    try {
      const movie = await Movie.find();

      if (!movie) {
        return res.status(400).json({ message: "There are no movie." });
      }

      res.status(201).json({ message: "Movie: ", movie });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
    });
     app.get("/api/v1/get/movie/:id", async (req, res) => {
    const { id } = req.params;
    const response = await Movie.findById(id);
    res.status(200).json({ message: "Movie fetched successfully", response });
  });


  // Update Movie Info
  app.put("/api/v1/update/movie/:id", async (req, res) => {
    const { id } = req.params;
    const { name, phone } = req.body;
    try {
      const response = await Movie.updateOne({ _id: id }, { name, phone });
      res.status(200).json({ message: "Movie updated successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delete Movie
  app.delete("/api/v1/delete/movie/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await Movie.findByIdAndDelete(id);
      res.status(200).json({ message: "Movie deleted successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};