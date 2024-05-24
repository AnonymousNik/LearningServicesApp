import express from "express"
import db from "../db.js"

const router = express.Router()

// GET VENDORS
router.get("/", (req, res) => {
    const q = "SELECT * FROM VENDOR";

    db.query(q, (err, data) => {
        if(err) return res.json({error:err});
        return res.json({data: data})
    })
})

// ADD VENDORS
router.post("/add_vendor", (req, res) => {

    db.query("SELECT COUNT(*) AS CNT FROM VENDOR WHERE VEMAIL=?", req.body.email, (err, data) => {
        if(err) return res.json({error: err});
        if(data[0].CNT > 0) {
            return res.status(400).json({error: "Vendor already exists"})
        } else {
            const q = "INSERT INTO VENDOR (VNAME, VEMAIL, VPHONE, VPASSWORD, VTYPE) VALUES (?)";
            const values = [
                req.body.name,
                req.body.email,
                req.body.phone,
                req.body.password,
                req.body.type
            ]
            db.query(q, [values], (err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            })
        }
    })

})

export default router