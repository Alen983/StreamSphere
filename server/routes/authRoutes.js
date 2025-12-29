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

      //   Generate the OTP
      const digits = "0123456789";
      let newOTP = "";
      for (let i = 0; i < otpLength; i++) {
        newOTP += digits[Math.floor(Math.random() * 10)];
      }
      console.log("newOTP: ", newOTP);

      //   Check if user already exists
      const user = await User.findOne({ email });

    //   //   If user does not exist, then create a new one
    //   if (!user) {
    //     const response = await User.create({ email, otp: newOTP });
    //     res.status(201).json({ message: "OTP Sent Successfully", response });
    //   } else {
    //     const response = await User.updateOne({ email }, { otp: newOTP });
    //     res.status(201).json({ message: "OTP Sent Successfully", response });
    //   }
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send({ message: error.message });
      
      await sendEmail(email, newOTP);
      res.status(200).json({ message: "OTP Sent Successfully" });
      } catch (error) {
    res.status(500).json({ message: error.message });
  }
    // }
  });

  // Verify OTP & Login
  app.post("/api/v1/verify/otp/email", async (req, res) => {

    try{
      const { email, otp } = req.body;
      let user = await User.findOne({ email });

      if (user){
        if (user.otp === otp){
          return res.status(200).json({ message: "Invalid OTP" });
      }
    }

    if (!user){
      user = await User.create({ email, otp });
    }

    await User.updateOne({ email }, { $unset: { otp: "" } });

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ message: "Login Success", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

//old code
    // console.log("Verify OTP 1");
    // try {
    //   const { email, otp } = req.body;
    //   console.log("Verify OTP 2", email, otp);

    //   const user = await User.findOne({ email });
    //   console.log("Verify OTP 3", user);

    //   if (user && user.otp === otp) {
    //     const payload = {
    //       id: user._id,
    //       email: user.email,
    //     };
    //     console.log("Verify OTP 4");

    //     const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //       expiresIn: process.env.JWT_EXPIRES_IN,
    //     });
    //     console.log("Verify OTP 5");

    //     res.status(200).json({ message: "Login Success", token });
    //     console.log("Verify OTP 6");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send({ message: error.message });
    // }
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
