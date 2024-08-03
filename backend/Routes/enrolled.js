import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"

const router = express.Router()


// get all enrolled courses EXAMPLE URL: http://localhost:8800/enrolled/
router.get('/', (req, res) => {
    const q = "SELECT * FROM ENROLLED_COURSES";

    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// get all enrolled_courses by userid EXAMPLE URL: http://localhost:8800/enrolled/u/1
router.get('/u/:id', (req, res) => {
    const userId = req.params.id;

    // console.log("Enrolled courses user id ", req.params)
    const q = "SELECT C.* FROM ENROLLED_COURSES E JOIN COURSE C ON E.CID=C.CID AND UID LIKE ?";

    db.query(q, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// get all enrolled_courses by courseid EXAMPLE URL: http://localhost:8800/enrolled/c/1
router.get('/c/:id', (req, res) => {
    const courseId = req.params.id;

    const q = "SELECT * FROM ENROLLED_COURSES WHERE CID LIKE ?";

    db.query(q, [courseId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

// GET ALL ENROLLED USERS BY VENDOR ID EXAMPLE URL: http://localhost:8800/enrolled/getusersbyvid
router.get('/getusersbyvid/:id', (req, res) => {
    const courseId = req.params.id;

    const q = "SELECT U.UID, U.UNAME, U.UEMAIL, U.UPHONE, U.VERIFIED, C.CNAME FROM USER U JOIN ENROLLED_COURSES E ON U.UID=E.UID JOIN COURSE C ON C.CID=E.CID AND C.CVID=?";

    db.query(q, [courseId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
}) 

// check if course is enrolled by user EXAMPLE URL: http://localhost:8800/enrolled/isenroll
router.post('/isenroll', (req, res) => {
    try {

        const courseID = req.body.cid;

        const token = req.headers['access-token'];

        if(!token) return res.json("User token not available")
        else {
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
                if(err) res.json(err)
                else {
                    req.uid = decoded.id;
                }
            })

            // console.log("inside enrolled function Is Enrolled ",req.uid,  courseID, req.body);

            const q = "SELECT * FROM ENROLLED_COURSES WHERE UID = ? AND CID = ?";
            db.query(q, [req.uid, courseID], (err, data) => {
                if(err) return res.json(err)
                else {
                    if(data.length>0) {return res.json({isEnrolled:true})}
                    else {return res.json({isEnrolled:false})}
                }
            })
        }

    } catch(err) {
        console.log(err)
    }
})

// add into enrolled_course EXAMPLE URL: http://localhost:8800/enrolled/add
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