import express from "express"
import db from "../db.js"

const router = express.Router();

// get all categories
router.get("/", (req, res) => {
    const q = "SELECT * FROM CATEGORY";

    db.query(q, (err, data) => {
        if(err) return res.json({error: err});
        return res.json(data);
    })
})

// add new category
router.post("/add", (req, res) => {
    db.query("SELECT COUNT(*) AS CNT FROM CATEGORY WHERE CCATEGORY=?", req.body.category, (err, data) => {
        if(err) return res.json({error: err});

        if(data[0].CNT > 0) {
            return res.status(400).json({error: "Category already exists"});
        } else {
            const q = "INSERT INTO CATEGORY(CCATEGORY) VALUES (?)";

            db.query(q, req.body.category, (err, data) => {
                if(err) return res.json({error: err});
                return res.json({data: data});
            })
        }
    })
})

// edit category
router.put("/update", (req, res) => {
    const q = "UPDATE CATEGORY SET CCATEGORY = ? WHERE CCATEGORY = ?";
    const values = [req.body.oldcategory, req.body.newcategory]
    console.log(values);

    db.query(q, values, (err, data) => {
        if(err) return res.json({error: err});
        console.log(data);
        return res.json({data: data});
    })
})
export default router