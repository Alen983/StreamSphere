import { Box, Typography } from "@mui/material";
import MediaCard from "@/components/common/MediaCard";

export default function FavoritesSection({ favorites = [] }) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#fff",
          mb: 3,
          fontSize: { xs: "1.25rem", md: "1.5rem" },
        }}
      >
        Your Favorites
      </Typography>
      {favorites.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 4,
            },
          }}
        >
          {favorites.map((favorite) => (
            <MediaCard key={favorite._id} media={favorite} />
          ))}
        </Box>
      ) : (
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            textAlign: "center",
            py: 4,
          }}
        >
          No favorites yet. Start adding movies and shows to your favorites!
        </Typography>
      )}
    </Box>
  );
}
