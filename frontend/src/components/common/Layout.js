import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Navbar at top - full width but centered content */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Navbar />
      </Box>

      {/* Page content - centered */}
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "1400px", lg: "1600px" },
          mx: "auto", // margin auto for horizontal centering
          // px: { xs: 2, sm: 1, md: 4 }, // padding on sides
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
