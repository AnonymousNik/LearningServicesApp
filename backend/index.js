import express from "express"

// const cors = require("cors")
import cors from "cors"

import course from "./Routes/course.js"
import user from "./Routes/user.js"
import vendor from "./Routes/vendor.js"
import category from "./Routes/category.js"
import admin from "./Routes/admin.js"
import enrolled from "./Routes/enrolled.js"
import payment from "./Routes/payment.js"
import orders from "./Routes/orders.js"


const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.json("Backend is running")
})


app.use("/courses", course)
app.use("/users", user);
app.use("/vendors", vendor);
app.use("/category", category);
app.use("/admin", admin);
app.use("/enrolled", enrolled);
app.use("/payment", payment);
app.use("/orders", orders);



app.listen(8800, ()=> {
    console.log("Connected to backend")
})