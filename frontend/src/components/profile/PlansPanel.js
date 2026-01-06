import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PlansPanel({ user, onPlanUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPremium =
    user?.subscriptionType?.toLowerCase() === "premium";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      accent: "#4caf50",
      features: [
        "Limited content access",
        "Standard quality",
        "Basic features",
        "Ads included",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 499,
      accent: "#ffd700",
      popular: true,
      features: [
        "Unlimited content",
        "HD & 4K quality",
        "Ad-free experience",
        "Offline downloads",
        "Priority support",
      ],
    },
  ];

  const handleSelect = (plan) => {
    if (plan.id === "free") {
      onPlanUpdate?.({ subscriptionType: "free" });
      alert("Free plan activated");
      return;
    }

    setLoading(true);
    setError("");

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: "INR",
      name: "StreamSphere",
      description: "Premium Subscription",
      handler: (res) => {
        onPlanUpdate?.({ subscriptionType: "premium" });
        alert("Payment successful: " + res.razorpay_payment_id);
        setLoading(false);
      },
      modal: { ondismiss: () => setLoading(false) },
      theme: { color: "#ffd700" },
    });

    razorpay.open();
  };

  return (
    /* ✅ SINGLE UNIFORM BACKGROUND */
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#f5f5f5", // change if needed
        py: 6,
      }}
    >
      

      {error && (
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => {
          const isCurrent =
            (plan.id === "premium" && isPremium) ||
            (plan.id === "free" && !isPremium);

          return (
            <Grid item xs={12} sm={6} md={5} key={plan.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  border: isCurrent
                    ? `3px solid ${plan.accent}`
                    : "2px solid #e0e0e0",
                }}
              >
                {plan.popular && (
                  <Chip
                    label="POPULAR"
                    size="small"
                    sx={{
                      bgcolor: "#ffd700",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  />
                )}

                <Typography variant="h5" fontWeight={700}>
                  {plan.name}
                </Typography>

                <Typography variant="h4" fontWeight={700} my={1}>
                  {plan.price === 0 ? "Free" : `₹${plan.price}`}
                  {plan.price > 0 && (
                    <Typography component="span" variant="body2">
                      {" "}
                      / month
                    </Typography>
                  )}
                </Typography>

                {plan.features.map((f) => (
                  <Box key={f} display="flex" alignItems="center" mb={1}>
                    <CheckCircleIcon
                      sx={{ color: plan.accent, mr: 1 }}
                    />
                    <Typography>{f}</Typography>
                  </Box>
                ))}

                {isCurrent ? (
                  <Typography
                    align="center"
                    fontWeight={700}
                    mt={2}
                    color={plan.accent}
                  >
                    Current Plan
                  </Typography>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: plan.popular ? "#ffd700" : "#111",
                      color: plan.popular ? "#000" : "#fff",
                    }}
                    disabled={loading}
                    onClick={() => handleSelect(plan)}
                  >
                    {loading ? "Processing..." : "Select Plan"}
                  </Button>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}


