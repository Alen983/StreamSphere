const errorCodes = {
  server_error: {
    code: 500,
    message: "Server error",
  },
  unauthorized: {
    code: 401,
    message: "Unauthorized",
  },
  invalid_body: {
    code: 400,
    message: "Invalid body",
  },
  user_not_found: {
    code: 404,
    message: "User not found",
  },
  invalid_phone_number: {
    code: 400,
    message: "Invalid phone number",
  },
  invalid_otp: {
    code: 400,
    message: "Invalid OTP",
  },
  unable_to_update_details: {
    code: 400,
    message: "Unable to update details. Please try again later.",
  },
  blog_not_found: {
    code: 400,
    message: "Blog post not found",
  },
  comment_not_found: {
    code: 400,
    message: "Comment not found",
  },
  payment_not_found: {
    code: 400,
    message: "Payment not found",
  },
  payment_verification_failed: {
    code: 400,
    message: "Payment verification failed",
  },
};

module.exports = errorCodes;