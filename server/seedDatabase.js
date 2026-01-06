const mongoose = require("mongoose");
require("dotenv").config();

// Import models
require("./models/Genre");
require("./models/Media");

const { Genre } = require("./models/Genre");
const { Media } = require("./models/Media");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Genres to seed
const genres = [
  { name: "action", description: "Action-packed movies and series" },
  { name: "thriller", description: "Suspenseful and thrilling content" },
  { name: "drama", description: "Dramatic storytelling" },
  { name: "sci-fi", description: "Science fiction adventures" },
  { name: "comedy", description: "Funny and entertaining content" },
  { name: "horror", description: "Scary and horror content" },
  { name: "romance", description: "Romantic stories" },
  { name: "documentary", description: "Real-life documentaries" },
  { name: "animation", description: "Animated content" },
  { name: "crime", description: "Crime and mystery" },
];

// Sample media data
const getSampleMedia = (genreIds) => [
  // Movies
  {
    type: "movie",
    name: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rating: 9.0,
    languages: ["English"],
    genres: [genreIds.action, genreIds.crime, genreIds.drama],
    releaseDate: new Date("2008-07-18"),
    duration: 152,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    videoUrl: "https://example.com/videos/dark-knight.mp4",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    country: "USA",
    ageRating: "PG-13",
  },
  {
    type: "movie",
    name: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    rating: 8.8,
    languages: ["English"],
    genres: [genreIds.action, genreIds["sci-fi"], genreIds.thriller],
    releaseDate: new Date("2010-07-16"),
    duration: 148,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    videoUrl: "https://example.com/videos/inception.mp4",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    country: "USA",
    ageRating: "PG-13",
  },
  {
    type: "movie",
    name: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    rating: 9.3,
    languages: ["English"],
    genres: [genreIds.drama],
    releaseDate: new Date("1994-09-23"),
    duration: 142,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    videoUrl: "https://example.com/videos/shawshank.mp4",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman"],
    country: "USA",
    ageRating: "R",
  },
  {
    type: "movie",
    name: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 8.6,
    languages: ["English"],
    genres: [genreIds["sci-fi"], genreIds.drama],
    releaseDate: new Date("2014-11-07"),
    duration: 169,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    videoUrl: "https://example.com/videos/interstellar.mp4",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    country: "USA",
    ageRating: "PG-13",
  },
  {
    type: "movie",
    name: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    rating: 9.2,
    languages: ["English"],
    genres: [genreIds.crime, genreIds.drama],
    releaseDate: new Date("1972-03-24"),
    duration: 175,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    videoUrl: "https://example.com/videos/godfather.mp4",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    country: "USA",
    ageRating: "R",
  },
  // Series
  {
    type: "series",
    name: "Breaking Bad",
    description:
      "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's future.",
    rating: 9.5,
    languages: ["English"],
    genres: [genreIds.crime, genreIds.drama, genreIds.thriller],
    releaseDate: new Date("2008-01-20"),
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
    videoUrl: "https://example.com/videos/breaking-bad.mp4",
    director: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
    country: "USA",
    ageRating: "TV-MA",
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        title: "Pilot",
        description:
          "Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with former student Jesse Pinkman to cook crystal meth.",
        duration: 58,
        releaseDate: new Date("2008-01-20"),
        rating: 9.0,
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/thumbnail1.jpg",
        videoUrl: "",
      },
      {
        episodeNumber: 2,
        seasonNumber: 1,
        title: "Cat's in the Bag...",
        description:
          "Walt and Jesse attempt to dispose of the two corpses in the RV.",
        duration: 48,
        releaseDate: new Date("2008-01-27"),
        rating: 8.7,
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/thumbnail2.jpg",
        videoUrl: "",
      },
    ],
  },
  {
    type: "series",
    name: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    rating: 8.7,
    languages: ["English"],
    genres: [genreIds["sci-fi"], genreIds.horror, genreIds.drama],
    releaseDate: new Date("2016-07-15"),
    posterUrl:
      "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    videoUrl: "https://example.com/videos/stranger-things.mp4",
    director: "The Duffer Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder"],
    country: "USA",
    ageRating: "TV-14",
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        title: "Chapter One: The Vanishing of Will Byers",
        description:
          "On his way home from a friend's house, young Will sees something terrifying.",
        duration: 47,
        releaseDate: new Date("2016-07-15"),
        rating: 8.8,
        thumbnailUrl: "https://image.tmdb.org/t/p/w500/thumbnail3.jpg",
        videoUrl: "",
      },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Genre.deleteMany({});
    await Media.deleteMany({});
    console.log("✅ Existing data cleared\n");

    // Seed genres
    console.log("📚 Seeding genres...");
    const createdGenres = await Genre.insertMany(genres);
    console.log(`✅ ${createdGenres.length} genres created\n`);

    // Create genre ID map
    const genreIds = {};
    createdGenres.forEach((genre) => {
      genreIds[genre.name] = genre._id;
    });

    // Seed media
    console.log("🎬 Seeding media...");
    const sampleMedia = getSampleMedia(genreIds);
    const createdMedia = await Media.insertMany(sampleMedia);
    console.log(`✅ ${createdMedia.length} media items created\n`);

    // Summary
    console.log("📊 Seed Summary:");
    console.log(`   - Genres: ${createdGenres.length}`);
    console.log(
      `   - Movies: ${createdMedia.filter((m) => m.type === "movie").length}`
    );
    console.log(
      `   - Series: ${createdMedia.filter((m) => m.type === "series").length}`
    );
    console.log("\n✨ Database seeded successfully!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();
