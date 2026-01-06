import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import api from "@/lib/api";

export default function OnboardingForm({
  email,
  token,
  onComplete,
  setError,
  setMessage,
  error,
  message,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      console.log("Submitting onboarding data:", { name, phone });
      const response = await api.post("/api/v1/user/onboarding", {
        name,
        phone,
      });
      console.log("Onboarding Response:", response.data);

      if (response.data.message === "Onboarding completed successfully") {
        setMessage("Profile completed successfully! Redirecting...");

        // Wait a moment to show success message, then call onComplete
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 1500);
      } else {
        setError(response.data.message || "Failed to complete onboarding.");
      }
    } catch (error) {
      console.error("Onboarding Error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        setError(
          "Cannot connect to server. Please ensure the backend server is running on port 5001."
        );
      } else if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to complete onboarding. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            mb: 2,
            fontSize: "0.9rem",
          }}
        >
          Please provide some information to get started.
        </Typography>

        {/* Name Field */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "#333",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Enter your name
          </Typography>
          <TextField
            fullWidth
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f5f5f5",
                borderRadius: 0,
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d32f2f",
                },
              },
              "& .MuiInputBase-input": {
                py: 1.5,
              },
            }}
          />
        </Box>

        {/* Phone Field */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "#333",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Enter your phone number
          </Typography>
          <TextField
            fullWidth
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            required
            placeholder="Enter your phone number"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f5f5f5",
                borderRadius: 0,
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d32f2f",
                },
              },
              "& .MuiInputBase-input": {
                py: 1.5,
              },
            }}
          />
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {message && (
          <Alert severity="success" sx={{ borderRadius: 0 }}>
            {message}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !name.trim() || !phone.trim()}
          fullWidth
          sx={{
            backgroundColor: "#d32f2f",
            color: "#fff",
            py: 1.5,
            borderRadius: 0,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
            "&:disabled": {
              backgroundColor: "#d32f2f",
              opacity: 0.6,
            },
          }}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Box>
            )
          }
        >
          {loading ? "Saving..." : "Complete Setup"}
        </Button>
      </Box>
    </form>
  );
}
