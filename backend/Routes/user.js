import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"
// require("dotenv").config()
import * as dotenv from "dotenv"

dotenv.config()

const router = express.Router()

// GET USERS
router.get("/", (req, res) => {
    const q = "SELECT * FROM USER";

    db.query(q, (err, data) => {
        if(err) return res.json({error: err});
        return res.json({data: data});
    })
})

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token) {
        return res.json("Need a token")
    } else {
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
            if(err) res.json("Not authenticated")
            else {
            req.uid = decoded.id;
        next();
    }
        })
    }
}

router.get("/checkauth", verifyJwt, (req, res) => {
    return res.json({status: "Authenticated", userid: req.uid});
})

// LOGIN
router.post("/login", (req, res) => {
    const q = "SELECT * FROM USER WHERE UEMAIL LIKE ?  AND UPASSWORD LIKE ?";

    db.query(q, [req.body.email, req.body.password], (err, data) =>{
        if(err) return res.json(err);

        if(data.length > 0) {
            const id = data[0].uid;
            // console.log("User id: ",id, "jwt secret key: ", process.env.REACT_APP_JWT_SECRET);

            const token = jwt.sign({id}, process.env.REACT_APP_JWT_SECRET, {expiresIn: 3000})
            return res.json({Login: true, token, data});
        } else {
            return res.json("User login Failure");
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