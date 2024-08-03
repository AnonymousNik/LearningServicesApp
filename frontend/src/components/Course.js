import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar';

function Course() {
    const [course, setCourse] = useState('')

    const [courseEnrollmentStatus, setCourseEnrollmentStatus] = useState(false)

    const location = useLocation();

    const courseId = location.pathname.split("/")[2];

    const [responseId, setResponseId] = useState('');

    const [responseState, setResponseState] = useState('');

    // to load script
    const loadscript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script")

            script.src = src;

            script.onload = () => {
                resolve(true)
            }

            script.onerror = () => {
                resolve(false)
            }

            document.body.appendChild(script)
        })
    }

    // to buy the course
    const handleBuyCourse = async (event) => {
        event.preventDefault();
        try {
            // console.log("User token from buy course - ", localStorage.getItem("token"));

            // Buy course function
            if (localStorage.getItem("token") === null) {
                alert("User not logged in, Please login to buy the course");
            } else {

                await order(course[0].CFEE * 100);

                // const result = await paymentFetch();

                // console.log("Payment fetch ", result)


                // await EnrolledCourse();

            }


        } catch (err) {
            console.log(err)
        }
    }

    // to add orders
    const order = async (amount) => {
        let data = {
            amount: amount,
            currency: "INR"
        }

        let config = {
            method: "POST",
            maxBodyLength: Infinity,
            url: `http://localhost:8800/orders`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }

        try {
            const res = await axios.request(config)
            console.log("Order function ", res)
            const paymentId = handleRazorpayScreen(res.data.amount)
            paymentFetch(paymentId);

        } catch (err) {
            console.log(err)
        }
    }

    // initiate razorpay payment screen
    const handleRazorpayScreen = async (amount) => {
        const res = await loadscript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            alert("Error occured at razorpay screen loading")
            return;
        }

        const options = {
            key: "rzp_test_WHaF5I8GKfCFsd",
            amount: amount,
            currency: "INR",
            name: "LearningServices",
            description: "Payment to LearningServices",
            image: "https://cdn.vectorstock.com/i/1000v/72/15/child-home-learning-logo-design-learn-online-vector-30927215.jpg",
            handler: function (response) {
                setResponseId(response.razorpay_payment_id)
            },
            prefill: {
                name: "LearningServices",
                email: "nikhil.mohite.nm1+learningservices@gmail.com"
            },
            theme: {
                color: "#F4C430"
            }
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

        // calling payment fetch function to verify payment
        // await paymentFetch();
        return responseId;
    }

    // verify payment details
    const paymentFetch = async (paymentId) => {

        try {

            // const paymentId = responseId;

            const res = await axios.get(`http://localhost:8800/payment/${paymentId}`)

            console.log(res)
            setResponseState(res.data)
            alert("Payment successful")
        } catch (err) {
            console.log(err)
        }

        // calling enrolled course function
        // await EnrolledCourse();
    }

    const EnrolledCourse = async () => {

        try {

            // console.log("CID Course.js: ", courseId)
            const res = await axios.request({
                method: 'POST',
                url: 'http://localhost:8800/enrolled/add',
                headers: { "access-token": localStorage.getItem("token") },
                data: { cid: courseId }
            })
            console.log(res.data)
            if (res.data === 'Error occured in jwt user id - make sure you are using valid details (uid, cid)') {
                // alert("User not logged in, Please login to buy the course");
                localStorage.removeItem("token");
            } else {
                window.location.reload();
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
                const res = await axios.get(`http://localhost:8800/courses/${courseId}`)
                setCourse(res.data);
                // console.log(res.data);

            } catch (err) {
                console.log(err);
            }
        }

        // to check if course is enrolled or not
        const isEnrolled = async () => {
            try {
                // console.log("calling isEnrolled function with cid ", courseId)
                const res = await axios.request({
                    method: 'POST',
                    url: 'http://localhost:8800/enrolled/isenroll/',
                    headers: { "access-token": localStorage.getItem("token") },
                    data: { cid: courseId }
                })
                // console.log("isEnrolled response ", res.data)
                if (res.data.name === "TokenExpiredError") localStorage.removeItem("token")

                if (res.data.isEnrolled) setCourseEnrollmentStatus(true);
            } catch (err) {
                console.log(err)
            }
        }

        isEnrolled();
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
                                    {courseEnrollmentStatus ?
                                        (<button type='submit' className='btn btn-secondary px-4 bg-light text-secondary'><strong><i> Already purchased </i></strong></button>)
                                        :
                                        (<button type='submit' className='btn btn-success px-4 bg-light text-success'><strong>Buy course for {course[0].CFEE} </strong></button>)
                                    }
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