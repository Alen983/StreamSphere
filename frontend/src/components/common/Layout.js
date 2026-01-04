import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Container
      sx={{
        minHeight: "100vh",
        px: 0,
      }}
    >
      {/* Navbar at top */}
      <Navbar />

      {/* Page content with top padding for fixed navbar */}
      <Box
        //component="main"
        sx={
          {
            // min,
            // maxWidth: { xs: "100%", md: "1400px", lg: "1600px" },
          }
        }
      >
        {children}
      </Box>
    </Container>
  );
}
