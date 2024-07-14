import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"

const router = express.Router()


// get all enrolled courses
router.get('/', (req, res) => {
    const q = "select * from enrolled_courses";

    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// get all enrolled_courses by userid
router.get('/u/:id', (req, res) => {
    const userId = req.params.uid;

    const q = "select * from enrolled_courses where uid = ?";

    db.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// get all enrolled_courses by courseid
router.get('/c/:id', (req, res) => {
    const courseId = req.params.cid;

    const q = "select * from enrolled_courses where cid = ?";

    db.query(q, [courseId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// add into enrolled_course
router.post('/add', (req, res) => {
    try{
        const token = req.headers["access-token"];
        // console.log("Token - ", token);
        // console.log("Headers  - ", req.headers);
        if(!token) return res.json("User token not available")
        else {
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
                if(err) {
                    console.log(err)
                    return res.json("Error occured in jwt user id - make sure you are using valid details (uid, cid)")
                } else {
                    req.uid = decoded.id;
                }
            })
            db.query("insert into enrolled_courses(uid, cid) values(?)", [[req.uid, req.body.cid]], (err, data) => {
                if(err) return res.json(err)
                    return res.json(data);
            })
        }
    } catch(err) {
        console.log(err);
    }
})

export default router