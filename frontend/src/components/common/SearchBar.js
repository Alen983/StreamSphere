import { useState } from "react";
import { Box, TextField, InputAdornment, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import api from "@/lib/api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = async (value) => {
    setQuery(value);
    
    if (value.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await api.get(`/api/v1/search?query=${value}`);
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleResultClick = (mediaId) => {
    setShowResults(false);
    setQuery("");
    router.push(`/media/${mediaId}`);
  };

  return (
    <Box sx={{ position: "relative", width: "300px" }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search movies & series..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#999" }} />
            </InputAdornment>
          ),
          sx: {
            color: "#fff",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.15)" },
          },
        }}
      />

      {showResults && results.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            bgcolor: "#1a1a1a",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          {results.map((item) => (
            <Box
              key={item._id}
              onClick={() => handleResultClick(item._id)}
              sx={{
                p: 2,
                cursor: "pointer",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(255, 215, 0, 0.1)" },
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "14px" }}>
                {item.name}
              </Typography>
              <Typography sx={{ color: "#999", fontSize: "12px" }}>
                {item.type} • {item.releaseYear}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

