const flutterwave = require ('flutterwave-node-v3');
const axios = require("axios");
const User = require('../Models/user.models');
const Wallet = require('../Models/wallet.models');


//create Redirect link URL with flutterwave

const createRedirectUrl = async (req, res) => {
  try {
    const { userId } = req.user;
    const { amount, currency, redirectUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!amount || !currency || !redirectUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get user details for the payment
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique transaction reference
    const txRef = `TX-${Date.now()}-${userId}`;

    // Initialize Flutterwave
    const flw = new flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY
    );

    // Create payment payload for Flutterwave Standard
    const payload = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      redirect_url: redirectUrl,
      customer: {
        email: user.email,
        phonenumber: user.phoneNumber,
        name: user.name,
      },
      customizations: {
        title: "Wallet Funding",
        description: "Fund your wallet",
      },
    };

    // Generate hosted payment link using Flutterwave Standard API
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(201).json({
      message: "Payment link created successfully",
      paymentLink: response.data.data.link,
      txRef: txRef,
    });
  } catch (e) {
    console.error("Error creating redirect URL:", e);
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};


// Flutterwave Webhook Handler
const flutterwaveWebhook = async (req, res) => {
  try {
    // Verify the webhook signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      console.log("Invalid webhook signature");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = req.body;

    // Check if payment was successful
    if (payload.status === "successful" && payload.event === "charge.completed") {
      const { tx_ref, amount, currency, id: transactionId } = payload.data;

      // Verify the transaction with Flutterwave
      const verifyResponse = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          },
        }
      );

      const verifyData = verifyResponse.data;

      if (
        verifyData.status === "success" &&
        verifyData.data.status === "successful" &&
        verifyData.data.amount === amount &&
        verifyData.data.currency === currency
      ) {
        // Extract userId from tx_ref (format: TX-timestamp-userId)
        const txParts = tx_ref.split("-");
        const userId = txParts[txParts.length - 1];

        // Find user's wallet and credit it
        const wallet = await Wallet.findOne({ userId: userId });

        if (wallet) {
          // Credit the wallet
          await Wallet.findOneAndUpdate(
            { userId: userId },
            { $inc: { balance: amount } },
            { new: true }
          );

          // Get user for email notification
          const user = await User.findById(userId);

          if (user) {
            // Send success email (optional)
            console.log(`Wallet funded successfully for user: ${user.email}, Amount: ${amount} ${currency}`);
          }

          return res.status(200).json({ message: "Wallet funded successfully" });
        } else {
          console.error("Wallet not found for userId:", userId);
          return res.status(404).json({ message: "Wallet not found" });
        }
      } else {
        console.error("Transaction verification failed", verifyData);
        return res.status(400).json({ message: "Transaction verification failed" });
      }
    }

    // For other events, just acknowledge receipt
    return res.status(200).json({ message: "Webhook received" });
  } catch (e) {
    console.error("Webhook error:", e);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};

module.exports = {createRedirectUrl, flutterwaveWebhook}