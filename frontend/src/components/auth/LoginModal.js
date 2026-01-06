import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Paper,
  IconButton,
  Typography,
  Dialog,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import LoginBackground from "./LoginBackground";
import LoginSideImage from "./LoginSideImage";
import LoginForm from "./LoginForm";
import OTPForm from "./OTPForm";
import OnboardingForm from "./OnboardingForm";

export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState("login"); // 'login', 'otp', or 'onboarding'
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated when modal opens, close it
    if (isAuthenticated && open && step === "login") {
      onClose();
    }
  }, [isAuthenticated, open, step, onClose]);

  const handleOTPSent = (userEmail) => {
    setEmail(userEmail);
    setStep("otp");
  };

  const handleOTPVerified = ({
    email: userEmail,
    token: userToken,
    isNewUser,
  }) => {
    console.log("handleOTPVerified called - isNewUser:", isNewUser);
    setEmail(userEmail);
    setToken(userToken);

    if (isNewUser) {
      // Show onboarding form for new users
      console.log("Setting step to onboarding");
      setStep("onboarding");
    } else {
      // For existing users, close modal and redirect to home
      console.log("Existing user - redirecting to home");
      onClose();
      router.push("/"); // Redirect to home page
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("login");
    } else if (step === "onboarding") {
      setStep("otp");
    }
    setError("");
    setMessage("");
  };

  const handleOnboardingComplete = () => {
    // After onboarding is complete, close modal and go to home
    onClose();
    router.push("/");
  };

  const handleClose = () => {
    // Reset all state when closing
    setStep("login");
    setEmail("");
    setToken("");
    setError("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          m: 2,
          borderRadius: 0,
          overflow: "hidden",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <Box
        sx={{
          minHeight: "600px",
          display: "flex",
          background:
            "linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cinematic Background Elements - Left Side */}
        <LoginBackground />

        {/* Main Container */}
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            minHeight: "600px",
            position: "relative",
            zIndex: 1,
            px: { xs: 2, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "900px",
              maxWidth: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <LoginSideImage />

            {/* Login Modal */}
            <Paper
              elevation={24}
              sx={{
                width: { xs: "100%", sm: "450px" },
                maxWidth: "450px",
                backgroundColor: "#ffffff",
                borderRadius: 0,
                position: "relative",
                p: 4,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "rgba(211, 47, 47, 0.1)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Title */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontFamily: 'var(--font-playfair), "Georgia", serif',
                  fontWeight: 700,
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  color: "#000",
                  mb: 1,
                  mt: 2,
                }}
              >
                {step === "onboarding"
                  ? "Complete Your Profile"
                  : "Welcome Back"}
              </Typography>

              {/* Subtitle */}
              {step !== "onboarding" && (
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    mb: 4,
                    fontSize: "0.95rem",
                  }}
                >
                  Stream anytime, anywhere with seamless experience.
                </Typography>
              )}

              {step === "login" ? (
                <LoginForm
                  onOTPSent={handleOTPSent}
                  setError={setError}
                  setMessage={setMessage}
                  error={error}
                  message={message}
                />
              ) : step === "otp" ? (
                <OTPForm
                  email={email}
                  onBack={handleBack}
                  onOTPVerified={handleOTPVerified}
                  setError={setError}
                  setMessage={setMessage}
                  error={error}
                  message={message}
                />
              ) : (
                <OnboardingForm
                  email={email}
                  token={token}
                  onComplete={handleOnboardingComplete}
                  setError={setError}
                  setMessage={setMessage}
                  error={error}
                  message={message}
                />
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
    </Dialog>
  );
}
