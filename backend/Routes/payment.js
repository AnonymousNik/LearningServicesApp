import express from "express"
import Razorpay from "razorpay";
// import { checkout } from "../Controller/paymentController.js";

const router = express.Router();

// checkout URL: http://localhost:8800/payment/checkout
// router.route("/checkout").post(checkout);

// to verify payment example URL: URL: http://localhost:8800/payment/:paymentId
router.get("/:paymentId", async (req, res) => {
    const {paymentId} = req.params;

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET
    })

    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if(!payment) {
            res.status(500).json("Error at razorpay loading ")
        }

        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        })
    } catch(err) {
        console.log(err)
        res.status(500).json("Payments - Failed to fetch payment")
    }
})

export default router;