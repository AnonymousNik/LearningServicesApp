import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar';

function Course() {
    const [course, setCourse] = useState('')

    const location = useLocation();

    const courseId = location.pathname.split("/")[2];

    // console.log(location.pathname.split("/")[2]);
    useEffect(() => {
        // get course by id
        const fetchCourseById = async () => {
            try {
                const res = await axios.get(`/courses/${courseId}`)
                setCourse(res.data);
                console.log(res.data);
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

            <div>
            <div className='d-flex text-align-center m-5 p-5'>
            <img src={`../images/${course[0].cimage}`} alt='' className='w-50 m-3 border border-dark rounded p-2'/>
            <div className='p-5'>
                <h1>Course name: {course[0].cname}</h1>
                <p><i>Course description: {course[0].cdescription}</i></p>
                <p className='text-danger'>Duration: {course[0].cduration} minutes</p>
                <p className='text-success'>Category: {course[0].ccategory} </p>
                <p className='btn btn-success px-4 bg-light text-success'><strong>Buy course for {course[0].cfee} </strong></p>
                <p className='text-muted'>By: {course[0].vname} </p>
            </div>
            </div>
            <div className='mx-5'><p>Batch capacity: {course[0].bcapacity}</p></div>
            <div className='mx-5'><p>Batch time: {course[0].in_time} - {course[0].out_time}</p></div>
            <div className='mx-5'> <p>Syllabus</p>{course.length ? course.map((c, i) => (<p>{i+1} - {c.scontents}</p>)):"No data"}</div>
            </div>
        ): "No data"}
    </div>
  )
}

export default Course