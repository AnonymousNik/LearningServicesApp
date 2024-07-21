import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"

const router = express.Router()


// get all enrolled courses
router.get('/', (req, res) => {
    const q = "SELECT * FROM ENROLLED_COURSES";

    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// get all enrolled_courses by userid
router.get('/u/:id', (req, res) => {
    const userId = req.params.id;

    console.log("Enrolled courses user id ", req.params)
    const q = "SELECT * FROM ENROLLED_COURSES WHERE UID LIKE ?";

    db.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// get all enrolled_courses by courseid
router.get('/c/:id', (req, res) => {
    const courseId = req.params.cid;

    const q = "SELECT * FROM ENROLLED_COURSES WHERE CID = ?";

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
                // console.log("Enrolled course ", req.uid, req.body.cid, decoded)
                }
            })
            db.query("INSERT INTO ENROLLED_COURSES(UID, CID) VALUES(?)", [[req.uid, req.body.cid]], (err, data) => {
                if(err) return res.json(err)
                    return res.json(data);
            })
        }
    } catch(err) {
        console.log(err);
    }
})

export default router