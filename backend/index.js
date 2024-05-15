import express from "express"
import mysql2 from "mysql2"

// const cors = require("cors")
import cors from "cors"

const app = express()

app.use(cors());
app.use(express.json());


const db_config = {
    host: "localhost",
    user: "myuser",
    password: "manager",
    database: "learningservices"
}

const db = mysql2.createConnection(db_config)

app.get("/", (req, res) => {
    res.json("Backend is running")
})

// ROUTE - GET COURSES
app.get("/elearning", (req, res) => {
    const q = "SELECT * FROM COURSES"
    db.query(q, (err, data) => {
        if(err) {
            console.log(err)
            return res.json(err)
        }            
        return res.json(data)
    })
})

// ROUTE - LOGIN
app.post("/login", (req, res) => {
    const q = "SELECT * FROM USERS WHERE UEMAIL LIKE ?  AND UPASSWORD LIKE ?";

    db.query(q, [req.body.email, req.body.password], (err, data) =>{
        if(err) return res.json(err);

        if(data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failure");
        }
    })
})

// ROUTE - SIGNUP
app.post("/signup", (req, res) => {
    const q = "INSERT INTO USERS (UNAME, UEMAIL, UPASSWORD) VALUES (?, ?, ?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})
app.listen(8800, ()=> {
    console.log("Connected to backend")
})