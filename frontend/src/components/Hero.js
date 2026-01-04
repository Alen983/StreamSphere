// src/components/Hero.js
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@/components/common/Button";
import LoginModal from "@/components/auth/LoginModal";

export default function Hero() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full viewport height
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        px: { xs: 3, md: 4, lg: 3 }, // Responsive padding
        position: "relative", // For overlay positioning
        backgroundImage: 'url("/hero_bg.jpg")', // Your background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000", // Fallback color
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)", // 30% black overlay
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ maxWidth: "700px", position: "relative", zIndex: 2 }}>
        {/* Main Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "48px", md: "72px" }, // Responsive font size
            fontWeight: 400,
            color: "#ffd700", // Golden yellow color
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
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </Box>
  );
}
