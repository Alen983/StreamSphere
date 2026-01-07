const mongoose = require("mongoose");
require("dotenv").config();

require("./models/Genre");
require("./models/Media");

const { Genre } = require("./models/Genre");
const { Media } = require("./models/Media");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Your S3 Bucket Configuration
const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME || "streamsphere-bucket";

// Simple helper for root-level files (no folders)
const createS3Url = (filename) => {
  return `s3://${S3_BUCKET}/${filename}`;
};

// Genres
const genres = [
  { name: "action", description: "Action-packed content" },
  { name: "thriller", description: "Suspenseful content" },
  { name: "drama", description: "Dramatic storytelling" },
  { name: "sci-fi", description: "Science fiction" },
  { name: "horror", description: "Horror content" },
  { name: "comedy", description: "Funny content" },
  { name: "romance", description: "Romantic stories" },
  { name: "fantasy", description: "Fantasy worlds" },
];

// Your Media Content
const getSampleMedia = (genreIds) => [
  // ============================================
  // STRANGER THINGS SEASON 5
  // ============================================
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
    trailerUrl: createS3Url("Stranger-Things-5-trailer.mp4"),
    director: "The Duffer Brothers",
    cast: [
      "Millie Bobby Brown",
      "Finn Wolfhard",
      "Winona Ryder",
      "David Harbour",
    ],
    country: "USA",
    ageRating: "TV-14",
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 5,
        title: "Episode 1",
        description: "Season 5, Episode 1 of Stranger Things",
        duration: 50,
        releaseDate: new Date("2024-01-01"),
        rating: 8.8,
        thumbnailUrl:
          "https://image.tmdb.org/t/p/w500/AdwF1v8OhcLGJMi6imPXf59cOKJ.jpg",
        videoUrl: createS3Url("StrangerThingsS05E01.mkv"),
      },
      {
        episodeNumber: 2,
        seasonNumber: 5,
        title: "Episode 2",
        description: "Season 5, Episode 2 of Stranger Things",
        duration: 52,
        releaseDate: new Date("2024-01-08"),
        rating: 8.6,
        thumbnailUrl:
          "https://image.tmdb.org/t/p/w500/qpj1R5lp6Ntv9xj5I5I71lsLq1f.jpg",
        videoUrl: createS3Url("StrangerThingsS05E02.mkv"),
      },
    ],
  },

  // ============================================
  // THE DARK KNIGHT
  // ============================================
  {
    type: "movie",
    name: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rating: 9.0,
    languages: ["English"],
    genres: [genreIds.action, genreIds.thriller, genreIds.drama],
    releaseDate: new Date("2008-07-18"),
    duration: 152,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    trailerUrl: createS3Url("The-Dark-Knight-trailer.mp4"),
    videoUrl: createS3Url("The-Dark-Knight-trailer.mp4"),
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    country: "USA",
    ageRating: "PG-13",
  },

  // ============================================
  // INCEPTION
  // ============================================
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
      "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    sliderPosterUrl:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: createS3Url("Inception-trailer.mp4"),
    videoUrl: createS3Url("Inception-trailer.mp4"),
    director: "Christopher Nolan",
    cast: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Ellen Page",
      "Tom Hardy",
    ],
    country: "USA",
    ageRating: "PG-13",
  },

  // ============================================
  // F1: THE MOVIE
  // ============================================
  {
    type: "movie",
    name: "F1",
    description:
      "A Formula 1 driver comes out of retirement to mentor a younger driver and take his final stab at glory on the track.",
    rating: 7.5,
    languages: ["English"],
    genres: [genreIds.action, genreIds.drama],
    releaseDate: new Date("2025-06-27"),
    duration: 130,
    posterUrl:
      "https://play-lh.googleusercontent.com/GAPgLw1XBPUkygT9c7JOIvYB3K9A6z-Pde-Tt12CxXUQ42WaWExG7ZtCSdGgK12Y02u6Qq5Bb0d6FCDqhIQ",
    sliderPosterUrl:
      "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2025/06/27132035/f1-movie-1600x900.jpeg",
    trailerUrl: createS3Url("F1-The-Movie-trailer.mp4"),
    videoUrl: createS3Url("F1-The-Movie-trailer.mp4"),
    director: "Joseph Kosinski",
    cast: ["Brad Pitt", "Damson Idris", "Kerry Condon", "Javier Bardem"],
    country: "USA",
    ageRating: "PG-13",
  },
];

// Seed Function
async function seedDatabase() {
  try {
    console.log("\n🌱 Starting database seed...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Genre.deleteMany({});
    await Media.deleteMany({});
    console.log("✅ Existing data cleared\n");

    // Create genres
    console.log("📚 Creating genres...");
    const createdGenres = await Genre.insertMany(genres);
    console.log(`✅ ${createdGenres.length} genres created\n`);

    // Build genre ID map
    const genreIds = {};
    createdGenres.forEach((genre) => {
      genreIds[genre.name] = genre._id;
    });

    // Create media
    console.log("🎬 Creating media content...");
    const sampleMedia = getSampleMedia(genreIds);
    const createdMedia = await Media.insertMany(sampleMedia);
    console.log(`✅ ${createdMedia.length} media items created\n`);

    // Summary
    const movies = createdMedia.filter((m) => m.type === "movie");
    const series = createdMedia.filter((m) => m.type === "series");
    const totalEpisodes = series.reduce((sum, s) => sum + s.episodes.length, 0);

    console.log("📊 Seed Summary:");
    console.log(`   ✓ Genres: ${createdGenres.length}`);
    console.log(`   ✓ Movies: ${movies.length}`);
    console.log(`   ✓ Series: ${series.length}`);
    console.log(`   ✓ Total Episodes: ${totalEpisodes}`);

    // List all video files expected in S3
    console.log("\n📹 S3 Video Files Referenced:");
    createdMedia.forEach((media) => {
      if (media.type === "series") {
        console.log(`\n   Series: ${media.name}`);
        media.episodes.forEach((ep) => {
          const filename = ep.videoUrl.split("/").pop();
          console.log(
            `      - S${ep.seasonNumber}E${ep.episodeNumber}: ${filename}`
          );
        });
        if (media.trailerUrl) {
          const trailerFile = media.trailerUrl.split("/").pop();
          console.log(`      - Trailer: ${trailerFile}`);
        }
      } else {
        const filename = media.videoUrl.split("/").pop();
        const trailerFile = media.trailerUrl
          ? media.trailerUrl.split("/").pop()
          : null;
        console.log(`\n   Movie: ${media.name}`);
        console.log(`      - Main: ${filename}`);
        if (trailerFile) console.log(`      - Trailer: ${trailerFile}`);
      }
    });

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📝 Next Steps:");
    console.log("   1. Ensure all video files listed above are uploaded to S3");
    console.log("   2. Start your backend: npm run dev");
    console.log("   3. Start your frontend: cd ../frontend && npm run dev");
    console.log("   4. Open http://localhost:3000 and test!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    console.error("\nTroubleshooting:");
    console.error("   - Check MongoDB connection");
    console.error("   - Verify .env variables");
    console.error("   - Check model imports\n");
    process.exit(1);
  }
}

// Run the seed
console.log("🚀 StreamSphere Database Seeder");
console.log("================================\n");
seedDatabase();
