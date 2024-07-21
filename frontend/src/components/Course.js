import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar';

function Course() {
    const [course, setCourse] = useState('')

    const location = useLocation();

    const courseId = location.pathname.split("/")[2];

    const handleBuyCourse = async (event) => {
        event.preventDefault();
        try {
            // console.log("User token from buy course - ", localStorage.getItem("token"));

            if (localStorage.getItem("token") === null) {
                alert("User not logged in, Please login to buy the course");
            } else {
                console.log("CID Course.js: ", course[0].CID)
                const res = await axios.request({
                    method: 'POST',
                    url: 'http://localhost:8800/enrolled/add',
                    headers: { "access-token": localStorage.getItem("token") },
                    data: { cid: course[0].CID }
                })
                console.log(res.data)
                if(res.data === 'Error occured in jwt user id - make sure you are using valid details (uid, cid)') {
                    // alert("User not logged in, Please login to buy the course");
                    localStorage.removeItem("token");
                }
            }


        } catch (err) {
            console.log(err)
        }
    }

    // console.log(location.pathname.split("/")[2]);
    useEffect(() => {
        // get course by id
        const fetchCourseById = async () => {
            try {
                const res = await axios.get(`/courses/${courseId}`)
                setCourse(res.data);
                // console.log(res.data);

            } catch (err) {
                console.log(err);
            }
        }

        fetchCourseById();
        // eslint-disable-next-line
    }, [])

    // console.log("Course.js ", course)
    return (
        <div>
            <Navbar />
            {course ? (

                <form action="" onSubmit={handleBuyCourse}>


                    <div>
                        <div className=' m-5 p-5 bg-light border border-5 rounded-4'>

                            <div className='d-flex text-align-center'>
                                <img src={`../images/${course[0].CIMAGE}`} alt='' className='w-50 m-3 p-2' />
                                <div className='p-5'>
                                    <h1>Course name: {course[0].CNAME}</h1>
                                    <p><i>Course description: {course[0].CDESCRIPTION}</i></p>
                                    <p className='text-danger'>Duration: {course[0].CDURATION} minutes</p>
                                    <p className='text-success'>Category: {course[0].CCATEGORY} </p>
                                    <button type='submit' className='btn btn-success px-4 bg-light text-success'><strong>Buy course for {course[0].CFEE} </strong></button>
                                    <p className='text-muted mt-3'>By: {course[0].VNAME} </p>
                                </div>
                            </div>
                            <div>
                            </div>

                            <div className='mx-5'><p><strong>Batch capacity: </strong>{course[0].BCAPACITY ? (<p>{course[0].BCAPACITY}</p>) : "Not available"}</p></div>
                            <div className='mx-5'><p><strong>Batch time: </strong>{course[0].IN_TIME ? (<p>{course[0].IN_TIME} - {course[0].OUT_TIME}</p>) : "Not available"}</p></div>
                            <div className='mx-5'> <p><strong>Syllabus</strong></p>{course.length > 1 ? (course.map((c, i) => (<p>{i + 1} - {c.SCONTENTS}</p>))) : "Syllabus not present"}</div>
                        </div>
                    </div>
                </form>
            ) : "No data"}
        </div>
    )
}

export default Course