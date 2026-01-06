import { Box, Typography, IconButton } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

export default function MediaRow({ title, children }) {
  return (
    <Box sx={{ py: 2, position: "relative" }}>
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#fff",
            fontSize: { xs: "1.2rem", md: "1.5rem" },
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Scrollable Row */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          px: 4,
          overflowX: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </Box>

      {/* Circular View More Button - Smaller */}
      <IconButton
        sx={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 48,
          height: 48,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          zIndex: 10,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-50%) scale(1.1)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <ArrowForward sx={{ fontSize: 24 }} />
      </IconButton>
    </Box>
  );
}
