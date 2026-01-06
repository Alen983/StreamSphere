// src/components/Hero.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, IconButton } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  Info,
} from "@mui/icons-material";
import Button from "@/components/common/Button";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";

export default function Hero({ slides = [] }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePlayNow = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    if (currentSlide?._id) {
      router.push(`/watch/${currentSlide._id}`);
    }
  };

  const handleMoreInfo = () => {
    if (currentSlide?.name) {
      const searchQuery = encodeURIComponent(currentSlide.name);
      window.open(`https://www.imdb.com/find?q=${searchQuery}`, "_blank");
    }
  };

  // Show static hero when user is NOT authenticated
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: { xs: 3, md: 4, lg: 3 },
          position: "relative",
          backgroundImage: 'url("/hero_bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ maxWidth: "700px", position: "relative", zIndex: 2 }}>
          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "48px", md: "72px" },
              fontWeight: 400,
              color: "#ffd700",
              mb: 3,
              fontFamily: "serif",
              lineHeight: 1.2,
            }}
          >
            One Platform. Infinite Worlds.
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              color: "rgba(255, 255, 255, 0.8)",
              mb: 4,
              lineHeight: 1.6,
              maxWidth: "500px",
            }}
          >
            Bringing you movies, shows, and originals from across the globe, all
            curated to keep you entertained, inspired, and connected.
          </Typography>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="medium"
            borderRadius="30px"
            onClick={() => setLoginModalOpen(true)}
          >
            Start Streaming
          </Button>
        </Box>
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />
      </Box>
    );
  }

  // Show empty state for authenticated users when no slides
  if (slides.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: { xs: 3, md: 4, lg: 3 },
          position: "relative",
          backgroundImage: 'url("/hero_bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ maxWidth: "700px", position: "relative", zIndex: 2 }}>
          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "48px", md: "72px" },
              fontWeight: 400,
              color: "#ffd700",
              mb: 3,
              fontFamily: "serif",
              lineHeight: 1.2,
            }}
          >
            One Platform. Infinite Worlds.
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              color: "rgba(255, 255, 255, 0.8)",
              mb: 4,
              lineHeight: 1.6,
              maxWidth: "500px",
            }}
          >
            Bringing you movies, shows, and originals from across the globe, all
            curated to keep you entertained, inspired, and connected.
          </Typography>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="medium"
            borderRadius="30px"
            onClick={() => router.push("/browse")}
          >
            Browse Content
          </Button>
        </Box>
      </Box>
    );
  }

  const currentSlide = slides[currentIndex];

  // Show carousel for authenticated users when slides exist
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Images with Transition */}
      {slides.map((slide, index) => (
        <Box
          key={slide._id}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${slide.sliderPosterUrl || slide.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            },
          }}
        />
      ))}

      {/* Content Overlay */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 6, lg: 8 },
        }}
      >
        <Box sx={{ maxWidth: "700px", ml: 2 }}>
          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem", lg: "2.5rem" },
              fontWeight: 700,
              color: "#fff",
              mb: 2,
              textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
              lineHeight: 1.2,
            }}
          >
            {currentSlide.name}
          </Typography>

          {/* Year & Type */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            {currentSlide.releaseDate && (
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                {new Date(currentSlide.releaseDate).getFullYear()}
              </Typography>
            )}
            {currentSlide.type && (
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                  px: 1.5,
                  py: 0.5,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1,
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {currentSlide.type}
              </Typography>
            )}
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.85rem" },
              color: "rgba(255, 255, 255, 0.85)",
              mb: 3,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
              maxWidth: "600px",
            }}
          >
            {currentSlide.description}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* White Primary Button */}
            <Button
              variant="primary"
              size="small"
              startIcon={<PlayArrow />}
              borderRadius="6px"
              onClick={handlePlayNow}
            >
              PLAY NOW
            </Button>

            {/* Outlined Button */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<Info />}
              borderRadius="6px"
              onClick={handleMoreInfo}
            >
              MORE INFO
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: "absolute",
              left: { xs: 10, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.8)",
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: { xs: 30, md: 40 } }} />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: "absolute",
              right: { xs: 10, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 },
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.8)",
              },
            }}
          >
            <ChevronRight sx={{ fontSize: { xs: 30, md: 40 } }} />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "flex",
            gap: 1,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: index === currentIndex ? 28 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor:
                  index === currentIndex
                    ? "#ffd700"
                    : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor:
                    index === currentIndex
                      ? "#ffd700"
                      : "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
