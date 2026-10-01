const express = require("express");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| SMAGRO PAYMENT CONFIG
|--------------------------------------------------------------------------
| Safe manual merchant payment flow.
| Live gateway credentials can be added later without changing checkout.
|--------------------------------------------------------------------------
*/

const PAYMENT_METHODS = {
  bkash: {
    name: "bKash",
    number: process.env.BKASH_MERCHANT_NUMBER || "01725117553",
    type: "manual",
  },

  nagad: {
    name: "Nagad",
    number: process.env.NAGAD_MERCHANT_NUMBER || "01725117553",
    type: "manual",
  },

  rocket: {
    name: "Rocket",
    number: process.env.ROCKET_MERCHANT_NUMBER || "01725117553",
    type: "manual",
  },
};

/*
|--------------------------------------------------------------------------
| GET PAYMENT METHODS
|--------------------------------------------------------------------------
*/

router.get("/methods", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      methods: Object.entries(PAYMENT_METHODS).map(
        ([id, method]) => ({
          id,
          name: method.name,
          number: method.number,
          type: method.type,
        })
      ),
    });
  } catch (error) {
    console.error("Payment methods error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load payment methods.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT REQUEST
|--------------------------------------------------------------------------
*/

router.post("/create", async (req, res) => {
  try {
    const {
      paymentMethod,
      amount,
      orderId,
    } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    const method =
      PAYMENT_METHODS[paymentMethod.toLowerCase()];

    if (!method) {
      return res.status(400).json({
        success: false,
        message: "Unsupported payment method.",
      });
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    return res.status(200).json({
      success: true,
      payment: {
        paymentMethod,
        methodName: method.name,
        merchantNumber: method.number,
        amount: numericAmount,
        orderId: orderId || null,
        status: "pending",
        instructions: [
          `Open your ${method.name} app.`,
          `Send ৳${numericAmount} to ${method.number}.`,
          "Complete the payment.",
          "Keep your Transaction ID.",
          "Enter the Transaction ID in SMAGRO checkout.",
        ],
      },
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment request.",
    });
  }
});

module.exports = router;