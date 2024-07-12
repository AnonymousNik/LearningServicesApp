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

            if(localStorage.getItem("token") === null) {
                alert("User not logged in, Please login to buy the course");
            } else {
                const res = await axios.post('http://localhost:8800/enrolled/add', {body: { cid: course.cid }},
                    {headers: { "access-token": localStorage.getItem("token") }
            })
                console.log(res.data)
            }
            
            
        } catch(err) {
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
                
            } catch(err) {
                console.log(err);
            }
        }

        fetchCourseById();
        // eslint-disable-next-line
    }, [])

  return (
    <div>
        <Navbar/>
        {course ? (

            <form action="" onSubmit={handleBuyCourse}>


                <div>
                <div className='d-flex text-align-center m-5 p-5'>
                <img src={`../images/${course[0].cimage}`} alt='' className='w-50 m-3 border border-dark rounded p-2'/>
                <div className='p-5'>
                    <h1>Course name: {course[0].cname}</h1>
                    <p><i>Course description: {course[0].cdescription}</i></p>
                    <p className='text-danger'>Duration: {course[0].cduration} minutes</p>
                    <p className='text-success'>Category: {course[0].ccategory} </p>
                    <button type='submit' className='btn btn-success px-4 bg-light text-success'><strong>Buy course for {course[0].cfee} </strong></button>
                    <p className='text-muted mt-3'>By: {course[0].vname} </p>
                </div>
                </div>
                <div className='mx-5'><p><strong>Batch capacity: </strong>{course[0].bcapacity ? (<p>{course[0].bcapacity}</p>): "Not available"}</p></div>
                <div className='mx-5'><p><strong>Batch time: </strong>{course[0].in_time ? (<p>{course[0].in_time} - {course[0].out_time}</p>):"Not available"}</p></div>
                <div className='mx-5'> <p><strong>Syllabus</strong></p>{course.length>1 ? (course.map((c, i) => (<p>{i+1} - {c.scontents}</p>))):"Syllabus not present"}</div>
                </div>
            </form>
        ): "No data"}
    </div>
  )
}

export default Course