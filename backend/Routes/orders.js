import express from "express"
import Razorpay from "razorpay"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()

// to create order EXAMPLE URL: http://localhost:8800/orders
router.post("/", async (req, res) => {

    try {

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET
    })

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "receipt#1",
        payment_capture: 1
    }


        const response  = await razorpay.orders.create(options)

            console.log("Response ", response)
            

                res.status(200).json({
                    order_id: response.id,
                    currency: response.currency,
                    amount: response.amount
                })


    }catch(err) {
        console.log(err)
        res.status(500).json("Orders - Internal server error")
    }
})

export default router