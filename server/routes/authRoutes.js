const mongoose = require("mongoose");
const User = mongoose.model("users");
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const sendEmail = require("../utils/sendEmail");
const requireLogin = require("../middleware/requireMail");

const otpLength = 6;

module.exports = (app) => {
  // Send OTP
  app.post("/api/v1/send/otp/email", async (req, res) => {
    try {
      const { email } = req.body;

      // Generate the OTP
      const digits = "0123456789";
      let newOTP = "";
      for (let i = 0; i < otpLength; i++) {
        newOTP += digits[Math.floor(Math.random() * 10)];
      }
      console.log("newOTP: ", newOTP);

      // Check if user already exists
      let user = await User.findOne({ email });

      // If user does not exist, create a new one with OTP
      if (!user) {
        user = await User.create({ email, otp: newOTP });
      } else {
        // Update existing user with new OTP
        await User.updateOne({ email }, { otp: newOTP });
      }

      // Send OTP via email
      await sendEmail(email, newOTP);
      res.status(200).json({ message: "OTP Sent Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Verify OTP & Login
  app.post("/api/v1/verify/otp/email", async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found. Please request OTP first." });
      }

      // Validate OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Clear OTP after successful verification
      await User.updateOne({ email }, { $unset: { otp: "" } });

      // Check if user needs onboarding (no name or phone)
      const needsOnboarding = !user.name || !user.phone;

      // Generate JWT token
      const payload = {
        id: user._id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(200).json({
        message: "Login Success",
        token,
        isNewUser: needsOnboarding,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // User Onboarding - Save name, phone, and other fields
  app.post("/api/v1/user/onboarding", requireLogin, async (req, res) => {
    try {
      const { name, phone, ...otherFields } = req.body;
      const userId = req.user.id;

      // Update user with onboarding data
      const updateData = { name, phone, ...otherFields };
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, select: "-otp" }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Onboarding completed successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get Current User
  app.get("/api/v1/current/user", requireLogin, async (req, res) => {
    console.log("CURRENT USER: ", req);

    try {
      const user = await User.findById(req.user.id, "-otp");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Current User", user });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });
};
