// src/components/common/MediaCard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

export default function MediaCard({ media, showWatchlistButton = true }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if media is in watchlist when component mounts
    if (isAuthenticated && showWatchlistButton) {
      checkWatchlistStatus();
    }
  }, [isAuthenticated, media._id]);

  const checkWatchlistStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/v2/watchlist/check/${media._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setInWatchlist(data.inWatchlist);
      }
    } catch (error) {
      console.error("Error checking watchlist status:", error);
    }
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      console.log("Not authenticated");
      return;
    }

    console.log("Toggle watchlist for media:", media._id);
    console.log("Current inWatchlist state:", inWatchlist);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = `/api/v2/watchlist/${media._id}`;
      const method = inWatchlist ? "DELETE" : "POST";

      console.log("Making request:", method, url);

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        setInWatchlist(!inWatchlist);
        console.log("Watchlist updated, new state:", !inWatchlist);
      } else {
        console.error("Failed:", data.message);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to player page
    router.push(`/watch/${media._id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        minWidth: 200,
        maxWidth: 200,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.3s ease",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        "&:hover .card-overlay": {
          opacity: 1,
        },
        "&:hover .watchlist-button": {
          opacity: 1,
        },
      }}
    >
      {/* Poster Image */}
      <CardMedia
        component="img"
        height="240"
        image={media.posterUrl}
        alt={media.name}
        sx={{
          objectFit: "cover",
        }}
      />

      {/* Watchlist Button */}
      {showWatchlistButton && isAuthenticated && (
        <Tooltip
          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          <IconButton
            className="watchlist-button"
            onClick={handleWatchlistToggle}
            disabled={loading}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: inWatchlist ? "#ffd700" : "#fff",
              opacity: 0,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                transform: "scale(1.1)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : inWatchlist ? (
              <Bookmark />
            ) : (
              <BookmarkBorder />
            )}
          </IconButton>
        </Tooltip>
      )}

      {/* Overlay Content - Shows on Hover */}
      <CardContent
        className="card-overlay"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: "0.9rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 0.5,
            color: "#fff",
            lineHeight: 1.3,
          }}
        >
          {media.name}
        </Typography>

        {/* Rating */}
        {media.rating && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: "#ffd700",
              mb: 0.5,
            }}
          >
            ⭐ {media.rating}
          </Typography>
        )}

        {/* Genres */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.75rem",
            color: "rgba(255, 255, 255, 0.7)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {media.genres?.map((g) => g.name).join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
}
