const { User } = require("../models/User");
const { OTP } = require("../models/OTP");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService");
const { generateToken, protect } = require("../middleware/authMiddleware");

module.exports = (app) => {
  // @route   POST /api/auth/send-otp
  // @desc    Send OTP to email (for both new and existing users)
  // @access  Public
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      // Clean up old OTPs for this email
      await OTP.cleanupOldOTPs(email.toLowerCase());

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create new OTP record
      const newOTP = new OTP({
        email: email.toLowerCase(),
        otp: otpCode,
      });

      await newOTP.save();

      // Send OTP via email
      const emailResult = await sendOTPEmail(email, otpCode, !existingUser);

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
        isNewUser: !existingUser,
        email: email.toLowerCase(),
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again later.",
      });
    }
  });

  // @route   POST /api/auth/verify-otp
  // @desc    Verify OTP (for login or before registration)
  // @access  Public
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Validate input
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      // Find the latest OTP for this email
      const otpRecord = await OTP.findOne({
        email: email.toLowerCase(),
        verified: false,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP expired or not found. Please request a new OTP.",
        });
      }

      // Check attempts
      if (otpRecord.attempts >= 5) {
        return res.status(400).json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        });
      }

      // Verify OTP
      const isMatch = await otpRecord.compareOTP(otp);

      if (!isMatch) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
        });
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        // Existing user - LOGIN
        existingUser.lastLogin = Date.now();
        await existingUser.save();

        const token = generateToken(existingUser._id);

        return res.status(200).json({
          success: true,
          message: "Login successful",
          isNewUser: false,
          token,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
            phone: existingUser.phone,
            profilePicture: existingUser.profilePicture,
            watchlistCount: existingUser.watchlistCount,
          },
        });
      } else {
        // New user - needs to complete registration
        return res.status(200).json({
          success: true,
          message: "OTP verified. Please complete your registration.",
          isNewUser: true,
          email: email.toLowerCase(),
        });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify OTP. Please try again.",
      });
    }
  });

  // @route   POST /api/auth/register
  // @desc    Complete registration for new user (after OTP verification)
  // @access  Public
  app.post("/api/auth/register", async (req, res) => {
    try {
      const {
        email,
        name,
        phone,
        dateOfBirth,
        profilePicture,
        favoriteGenres,
        favoriteLanguages,
      } = req.body;

      // Validate required fields
      if (!email || !name) {
        return res.status(400).json({
          success: false,
          message: "Email and name are required",
        });
      }

      // Verify that OTP was verified for this email
      const verifiedOTP = await OTP.findOne({
        email: email.toLowerCase(),
        verified: true,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (!verifiedOTP) {
        return res.status(400).json({
          success: false,
          message: "Please verify your email with OTP first",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Create new user
      const newUser = new User({
        email: email.toLowerCase(),
        name,
        phone: phone || "",
        dateOfBirth: dateOfBirth || null,
        profilePicture: profilePicture || "",
        preferences: {
          favoriteGenres: favoriteGenres || [],
          favoriteLanguages: favoriteLanguages || [],
        },
      });

      await newUser.save();

      // Generate JWT token
      const token = generateToken(newUser._id);

      // Send welcome email (don't wait for it)
      sendWelcomeEmail(newUser.email, newUser.name).catch((err) =>
        console.error("Failed to send welcome email:", err)
      );

      // Clean up verified OTP
      await OTP.deleteOne({ _id: verifiedOTP._id });

      res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          profilePicture: newUser.profilePicture,
          preferences: newUser.preferences,
          watchlistCount: 0,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
      });
    }
  });

  // @route   GET /api/auth/me
  // @desc    Get current user profile
  // @access  Private
  app.get("/api/auth/me", protect, async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        user: {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          phone: req.user.phone,
          dateOfBirth: req.user.dateOfBirth,
          profilePicture: req.user.profilePicture,
          preferences: req.user.preferences,
          watchlistCount: req.user.watchlistCount,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  });

  // @route   PUT /api/auth/profile
  // @desc    Update user profile
  // @access  Private
  app.put("/api/auth/profile", protect, async (req, res) => {
    try {
      const {
        name,
        phone,
        dateOfBirth,
        profilePicture,
        favoriteGenres,
        favoriteLanguages,
      } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
      if (profilePicture !== undefined)
        updateData.profilePicture = profilePicture;

      if (favoriteGenres || favoriteLanguages) {
        updateData.preferences = {};
        if (favoriteGenres)
          updateData["preferences.favoriteGenres"] = favoriteGenres;
        if (favoriteLanguages)
          updateData["preferences.favoriteLanguages"] = favoriteLanguages;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          dateOfBirth: updatedUser.dateOfBirth,
          profilePicture: updatedUser.profilePicture,
          preferences: updatedUser.preferences,
          watchlistCount: updatedUser.watchlistCount,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  });
};
