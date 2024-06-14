import express from "express"
import db from "../db.js"
import multer from "multer"

const router = express.Router()

// get all courses
router.get ('/', (req, res) => {
    // const q = "SELECT * FROM COURSE";
    const q = "select cid, cname, cdescription, cfee, cimage, cduration, ccategory, v.vname from course c,  vendor v where c.cvid = v.vid";

    db.query(q, (err, data) => {
        if(err) return res.json({error:err});
        return res.json(data);
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

// used multer to store images 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./public/images")
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

// add new course
router.post("/add", upload.single('cimage'), (req, res) => {
    
    const q = "INSERT INTO COURSE(CNAME, CDESCRIPTION, CFEE, CDURATION, CCATEGORY, CVID, CIMAGE) VALUES (?)";

    const values = [
        req.body.cname,
        req.body.cdescription,
        req.body.cfee,
        req.body.cduration,
        req.body.ccategory,
        req.body.cvid,
        // req.body.cimage,
        req.file.filename
    ]
    const bvalues = [
        req.body.bcapacity,
        req.body.bintime,
        req.body.bouttime
    ]
    console.log(values, 'batch values: ', bvalues, ' syllabus: ', req.body.syllabus, req.body.syllabus.length, req.body.syllabus[0]);
    let count = 0
    // for(let item of req.body.syllabus) {
    //     console.log(item)
    //     count += 1
    // }
    // console.log(count)
    let newArray = JSON.parse(req.body.syllabus)
    console.log(newArray)
    console.log(newArray.length)

    db.query(q, [values], (err, data) => {
        if(err) return res.json(err);
        console.log("\n after executing the query ", data);
        return res.json(data);
    })
})

export default router