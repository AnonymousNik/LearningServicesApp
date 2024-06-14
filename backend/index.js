import express from "express"

// const cors = require("cors")
import cors from "cors"

import course from "./Routes/course.js"
import user from "./Routes/user.js"
import vendor from "./Routes/vendor.js"
import category from "./Routes/category.js"
import admin from "./Routes/admin.js"

const app = express()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json("Backend is running")
})


app.use("/courses", course)
app.use("/users", user);
app.use("/vendors", vendor);
app.use("/category", category);
app.use("/admin", admin);



app.listen(8800, ()=> {
    console.log("Connected to backend")
})