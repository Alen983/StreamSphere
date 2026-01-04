const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"StreamSphere" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your StreamSphere Login OTP",
    html: `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>StreamSphere Login</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f4f6f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0066cc, #004080);
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 30px;
      text-align: center;
      color: #333333;
    }
    .content p {
      font-size: 16px;
      margin: 10px 0;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      color: #0066cc;
      margin: 20px 0;
      letter-spacing: 4px;
    }
    .cta {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #f6f3f8ff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
    }
    .cta:hover {
      background-color: #004080;
    }
    .footer {
      background: #f4f6f9;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>StreamSphere Login</h2>
    </div>
    <div class="content">
      <p>Your One-Time Password (OTP) is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for a short time. Please use it promptly to complete your login.</p>
      <a href="#" class="cta">Happy Streaming :)</a>
    </div>
    <div class="footer">
      <p>© 2025 StreamSphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
