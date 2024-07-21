import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"

const router = express.Router()

// GET VENDORS
router.get("/", (req, res) => {
    const q = "SELECT * FROM VENDOR";

    db.query(q, (err, data) => {
        if(err) return res.json({error:err});
        return res.json({data: data})
    })
})

let vendor_id = 0;

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-vendor-token"];
    if(!token) {
        return res.json("Need a token")
    } else {
        jwt.verify(token, process.env.REACT_APP_JWT_SECRETKEY_VENDOR, (err, decoded) => {
            if(err) res.json("Not authenticated")
            else {
                req.vid = decoded.id;
                vendor_id = decoded.id;
                next()
            }
        })
    }
}

router.get("/checkauth", verifyJwt, (req, res) => {
    return res.json({vid: vendor_id, data: "Authenticated"})
})

// Vendor - LOGIN
router.post('/login', (req, res) => {
    const q = "SELECT * FROM VENDOR WHERE VEMAIL LIKE ? AND VPASSWORD LIKE ?";

    db.query(q, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json(err)

        // console.log(data, req.body.email, req.body.password, err)

        if(data.length > 0) {
            const id = data[0].VID;
            const token = jwt.sign({id}, process.env.REACT_APP_JWT_SECRETKEY_VENDOR, {expiresIn: '1h'})
            return res.json({Login: true, token, data})
        } else {
            return res.json("Vendor login Failure")
        }
    })
})

// ADD VENDORS
router.post("/add_vendor", (req, res) => {

    db.query("SELECT COUNT(*) AS CNT FROM VENDOR WHERE VEMAIL=?", req.body.email, (err, data) => {
        if(err) return res.json(err);
        if(data[0].CNT > 0) {
            return res.json("Vendor already exists")
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

// Delete vendor by id
router.delete('/delete/:id', (req, res) => {
    const q = "DELETE FROM VENDOR WHERE VID = ?";

    console.log("vendor id to be deleted", req.params.id);

    db.query(q, [req.params.id], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

export default router