import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"

import * as dotenv from "dotenv"
dotenv.config()

const router = express.Router()

// Verify JWT Token function
const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token) {
        return res.json("Token not available")
    } else {
        jwt.verify(token, process.env.REACT_APP_JWT_SECRETKEY_ADMIN, (err, decoded) => {
            if(err) res.json("Not authenticated")
            else req.aid = decoded.id;
        next();
        })
    }
}

//  Check authentication api
router.get("/checkauth", verifyJwt, (req, res) => {
    return res.json("Authenticated")
})

// ADMIN - LOGIN
router.post("/", (req, res) => {
    const q = "SELECT * FROM ADMIN WHERE AEMAIL = ? AND APASSWORD = ?";

    db.query(q, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json(err);

        if(data.length > 0) {

            const id = data[0].aid;

            // console.log("Secret key: ", process.env.REACT_APP_JWT_SECRETKEY_ADMIN);
            const token = jwt.sign({id}, process.env.REACT_APP_JWT_SECRETKEY_ADMIN, {expiresIn: 300})
            return res.json({Login:true, token, data});
        } else {
            return res.json("Failure");
        }
    })
    
})

export default router