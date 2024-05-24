import express from "express"
import db from "../db.js"

const router = express.Router()

// get all courses
router.get ('/', (req, res) => {
    // const q = "SELECT * FROM COURSE";
    const q = "select cid, cname, cdescription, cfee, cimage, cduration, ccategory, v.vname from course c,  vendor v where c.cvid = v.vid";

    db.query(q, (err, data) => {
        if(err) return res.json({error:err});
        return res.json({data: data});
    })
})

// get course by id
router.get('/:id', (req, res) => {
    const courseId = req.params.id;

    // console.log(courseId);
    const q = "select cid, cname, cdescription, cfee, cimage, cduration, ccategory, v.vname from course c,  vendor v where c.cvid = v.vid and c.cid = ?";

    db.query(q, [courseId], (err, data) => {
        if(err) return res.json({error: err});
        return res.json(data);
    })
})

// add new course
router.post("/add", (req, res) => {
    const q = "INSERT INTO COURSE(CNAME, CDESCRIPTION, CFEE, CIMAGE, CDURATION, CCATEGORY, CVID) VALUES (?)";

    const values = [
        req.body.name,
        req.body.description,
        req.body.fee,
        req.body.image,
        req.body.duration,
        req.body.category,
        req.body.vid,
    ]
    db.query(q, [values], (err, data) => {
        if(err) return res.json({error: err});
        return res.json({data: data});
    })
})

export default router