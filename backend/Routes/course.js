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

// get course by course id
router.get('/:id', (req, res) => {
    const courseId = req.params.id;

    // console.log(courseId);
    // const q = "select c.*, v.vname, b.bcapacity, b.in_time, b.out_time, s.scontents from course c,  vendor v, batch b, syllabus s where c.cvid = v.vid and c.cvid = b.vid and s.cid = c.cid and c.cid = ?";

    // issue in query
    const q = "select c.*, v.vname, b.bcapacity, b.in_time, b.out_time, s.scontents from course c left join vendor v on c.cvid = v.vid join batch b on c.cvid = b.vid left join syllabus s on s.cid = c.cid  and c.cid = ?";

    db.query(q, [courseId], (err, data) => {
        if(err) return res.json({error: err});
        return res.json(data);
    })
})

// get courses by vendor id
router.get('/v/:id', (req, res) => {
    const vendorId = req.params.id;

    const q = "SELECT * FROM COURSE WHERE CVID = ?";

    db.query(q, [vendorId], (err, data) => {
        if(err) return res.json(err);
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

    // insert course details in course table
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

    let syllabusArray = JSON.parse(req.body.syllabus)

    // console.log(syllabusArray.length)

    db.query(q, [values], (err, data) => {
        console.log("INSIDE course insert")
        if(err) return res.json(err);
        // console.log("\n after executing the query ", data);

        const {cname, cdescription, cfee, cvid, cduration, ccategory, bcapacity, bintime, bouttime, syllabus} = req.body;

        // to get the course id (CID) of the newly created course to insert batch and syllabus details
        // const cid = getCourseId(cname, cfee, cvid);
        
        db.query("SELECT MIN(CID) AS CID FROM COURSE WHERE CNAME=? AND CFEE=? AND CVID=?", [cname, cfee, cvid], (err, data) => {
            console.log("INSIDE course id select")
            if(err) console.error(err)
            
            console.log("Complete data ", data)
            console.log(data[0].CID)
            var cid = data[0].CID;

            // insert batch details in batch table
            let intime = formatDateTime(bintime), outtime = formatDateTime(bouttime)
            insertBatchDetails(cvid, cid, bcapacity, intime, outtime);
              
            // insert syllabus details in syllabus table
            insertSyllabusDetails(cid, syllabusArray);
            
            
            console.log("CID from getCourse id: ", cid)
        })
        

        //   // insert batch details in batch table
        //   let intime = formatDateTime(bintime), outtime = formatDateTime(bouttime)
        //   await insertBatchDetails(cvid, cid, bcapacity, intime, outtime);
              
        //   // insert syllabus details in syllabus table
        //   await insertSyllabusDetails(cid, syllabusArray);
          


        return res.json(data);
    })
})

// variable cid not accessible inside block 
function accessCID(cid) {
    return cid
}

// function to get course id
function getCourseId(cname, cfee, cvid) {

    var cid;
    db.query("SELECT MIN(CID) AS CID FROM COURSE WHERE CNAME=? AND CFEE=? AND CVID=?", [cname, cfee, cvid], (err, data) => {
        console.log("INSIDE course id select")
        if(err) console.error(err)
        
        console.log("Complete data ", data)
        console.log(data[0].CID)
        var cid = data[0].CID;
    })
    
    return cid

}

// function to insert batch details in batch table
function insertBatchDetails(cvid, cid, bcapacity, bintime, bouttime) {
    const batch_query = "INSERT INTO BATCH(VID, CID, BCAPACITY, IN_TIME, OUT_TIME) VALUES(?, ?, ?, ?, ?)";

          db.query(batch_query, [cvid, cid, bcapacity, bintime, bouttime], (err, data) => {
              console.log("INSIDE batch insert")
              if(err) console.error(err)

              console.log("batch details added")
              // res.json(data)
            })
}

// function to insert syllabus in syllabus table
function insertSyllabusDetails(cid, syllabusArray) {

    for(let i=0; i<syllabusArray.length; i++){
        let syllabus_query = "INSERT INTO SYLLABUS(CID, SCONTENTS) VALUES(?, ?)";
            
        db.query(syllabus_query, [cid, syllabusArray[i]], (err, data) => {
            console.log("INSIDE syllabus insert")
            if(err) console.error(err)
                    
            // res.json(data)
        })
    }
    console.log("syllabus details have been added")
}

// function to change the datetime format
function formatDateTime(old_date) {

    // separating date, time, and meridiem
    let datetimeArray = old_date.split(" ")
    let date = datetimeArray[0], time = datetimeArray[1], meridiem = datetimeArray[2]

    // separating day, month, and year from date
    let day = date.split("-")[0], month = date.split("-")[1], year = date.split("-")[2]

    // separating hour and minute from time
    let hour = time.split(":")[0], minute = time.split(":")[1]

    if(meridiem === 'PM') {
        let temp = Number(hour)
        hour = String(temp+12)
    }

    // correct formatted date as per mysql
    let newdate = year+'-'+month+'-'+day+' '+hour+':'+minute

    return newdate
}

export default router