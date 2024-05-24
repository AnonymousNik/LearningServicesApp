import express from "express"
import db from "../db.js"

const router = express.Router()

// GET USERS
router.get("/", (req, res) => {
    const q = "SELECT * FROM USER";

    db.query(q, (err, data) => {
        if(err) return res.json({error: err});
        return res.json({data: data});
    })
})

// LOGIN
router.post("/login", (req, res) => {
    const q = "SELECT * FROM USER WHERE UEMAIL LIKE ?  AND UPASSWORD LIKE ?";

    db.query(q, [req.body.email, req.body.password], (err, data) =>{
        if(err) return res.json(err);

        if(data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failure");
        }
    })
})

// SIGN UP
router.post("/signup", (req, res) => {
    // check if user email already exists or not
    db.query("SELECT COUNT(*) AS CNT FROM USER WHERE UEMAIL=?", req.body.email, (err, data) => {
        if(err) return res.json({error: err});

        // console.log(data[0].CNT, req.body.email);
        if(data[0].CNT > 0){
            return res.status(400).json({error: "User already exists"})
        }
        // if user email does not exists then insert new user
        else {
            const q = "INSERT INTO USER (UNAME, UEMAIL, UPHONE, UPASSWORD) VALUES (?)";
            const values = [
                req.body.name,
                req.body.email,
                req.body.phone,
                req.body.password
            ]
            db.query(q, [values], (err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            })
        }
    })

})

export default router