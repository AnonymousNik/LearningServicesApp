import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// import AddCourse from './AddCourse'

// import {Button, Card} from "react-bootstrap"

function Vendor() {

    const navigate = useNavigate('')

    // let vendorId = 0, enrolledUsersCount = 0;
    const vendorId = useRef(0);
    // var enrolledUsersCount = useRef(0);
    var [enrolledUsersCount, setEnrolledUsersCount] = useState(0)

    useEffect(() => {
        // vendor authentication
        const handleVendorAuth = async () => {
            try {
                const res = await axios.get('http://localhost:8800/vendors/checkauth', {
                    headers: {
                        "access-vendor-token": localStorage.getItem('vendor_token')
                    }
                })
                console.log(res.data)
                // const vendorId = res.data.vendor_id;
                vendorId.current = res.data.vid;

                if (res.data.data !== 'Authenticated') {
                    navigate('/vendor_login')
                } else {
                    
        getEnrolledUsersByVendorid(res.data.vid);
                }
            } catch (err) {
                console.log(err)
            }
        }

        // get all users who enrolled for the course authored by vendor ID
        const getEnrolledUsersByVendorid = async (vendorId) => {
            try {
                const res = await axios.get(`http://localhost:8800/enrolled/getusersbyvid/${vendorId}`)
                console.log("Vendor.js getEnrolledUsersByVendorid ", res.data, res.data.length)
                // enrolledUsersCount = res.data.length;
                setEnrolledUsersCount(res.data.length)

            } catch(err) {
                console.log(err);
            }
        }

        handleVendorAuth();

        // eslint-disable-next-line
    }, [])

    // console.log("CVID in Vendor page ", vendorId);
    console.log("Total enrolled users count ", enrolledUsersCount, vendorId.current, vendorId)

    return (
        <div className='d-flex'>
            <Link to={`/addcourse`} style={{ textDecoration: "none", color: "black" }}>
                <div style={{ backgroundColor: "ButtonFace", width: "auto", height: "15rem", border: "3px solid grey", borderRadius: "20px", padding: "30px", margin: "20px" }}>

                    <h1>Add New Course</h1>
                </div>
            </Link>
            <Link to={`/totalenrolledusers/${vendorId.current}`} style={{ textDecoration: "none", color: "black" }}>
                <div style={{ backgroundColor: "ButtonFace", width: "auto", height: "15rem", border: "3px solid grey", borderRadius: "20px", padding: "30px", margin: "20px", justifyContent:"center" }}>

                    <h1>Total Users enrolled my courses</h1>
                    <h2 style={{display: "flex", justifyContent: "center"}}>( {enrolledUsersCount} )</h2>
                </div>
            </Link>
        </div>
    )
}

export default Vendor