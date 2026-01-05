const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const CryptoJS = require("crypto-js");
// ==== IMPORT SERVICES ====
const errorCodes = require("../utils/errorCodes");

// ==== IMPORT MIDDLEWARE ====
const requireLogin = require("../middleware/requireMail");
// ==== IMPORT MODELS ====
const Payment = mongoose.model("payments");
const User = mongoose.model("users");

const ROUTE_TYPE = "USER";

/* HOW TO USE RAZORPAY
 * npm install razorpay crypto-js
 * create a razorpay account
 * set the account to test mode
 * and get the key and secret
 * create a .env file in the root of the project and add the RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
 * also create a .env.local file in client and add the RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
 */

module.exports = (app) => {
  // =============
  // ==== PAY ====
  // =============
  app.post("/api/v1/user/pay", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} PAYMENT ==== \n body:`, req.body);
    try {
      const PRICE = 499; // IN PAISE

      // ==== CREATE INSTANCE ====
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: PRICE * 100, // IN PAISE
        currency: "INR",
      };
      instance.orders.create(options, async (err, order) => {
        if (err) {
          console.log(`==== ${ROUTE_TYPE} PAYMENT ERROR ==== \n error:`, err);
          return res.status(500).send({
            error: errorCodes.server_error,
          });
        }
        // ==== CREATE PAYMENT ====
        const payment = await Payment.create({
          userId: req.user._id,
          amount: PRICE,
          orderId: order.id,
          status: "PENDING",
          orderId: order.id, //store the order id to verify the payment after payment is done
        });
        res.json({
          success: true,
          message: "Payment request created successfully",
          orderId: order.id,
        });
      });
    } catch (err) {
      console.log(`==== ${ROUTE_TYPE} PAYMENT ERROR ==== \n error:`, err);
      return res.status(500).send({
        error: errorCodes.server_error,
      });
    }
  });

  /*
   */

  // ==============================
  // ==== PAYMENT VERIFICATION ====
  // ==============================
  app.post("/api/v1/user/payment/verify", requireLogin, async (req, res) => {
    console.log(
      `==== ${ROUTE_TYPE} PAYMENT VERIFICATION ==== \n body:`,
      req.body
    );
    try {
      const { paymentId, orderId, signature } = req.body;
      const payment = await Payment.findOne({ orderId });
      if (!payment) {
        return res.status(400).send({
          error: errorCodes.payment_not_found,
        });
      }
      const generated_signature = CryptoJS.HmacSHA256(
        orderId + "|" + paymentId,
        process.env.RAZORPAY_KEY_SECRET
      ).toString();
      if (generated_signature !== signature) {
        return res.status(400).send({
          error: errorCodes.payment_verification_failed,
        });
      }
      // ==== UPDATE PAYMENT STATUS ====
      await Payment.findByIdAndUpdate(payment._id, {
        status: "SUCCESS",
      });
      // ==== UPDATE USER PLAN TO PRO ====
      await User.findByIdAndUpdate(req.user.id, {
        plan: "PRO",
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} PAYMENT VERIFICATION ERROR ==== \n error:`,
        err
      );
      return res.status(500).send({
        error: errorCodes.server_error,
      });
    }
  });
};
