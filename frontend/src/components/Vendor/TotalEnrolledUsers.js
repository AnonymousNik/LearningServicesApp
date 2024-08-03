import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function TotalEnrolledUsers() {

    const [totalEnrolledUsers, setTotalEnrolledUsers] = useState({})

    const navigate = useNavigate();
    // var vendorId = location.pathname.split("/")[2];
    const [vendorId, setVendorId] = useState(0);

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
                // vendorId = res.data.vid;
                setVendorId(res.data.vid);

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
                console.log("TotalEnrolledUsers.js getEnrolledUsersByVendorid ", res.data, res.data.length)
                // enrolledUsersCount = res.data.length;
                setTotalEnrolledUsers(res.data)

            } catch (err) {
                console.log(err);
            }
        }

        handleVendorAuth();

        // eslint-disable-next-line
    }, [])

    console.log("TotalEnrolledUsers.js vendor id ", vendorId)
    return (
        <div style={{ width: "50rem", margin: "5rem" }}>
            <h1># Users enrolled for courses</h1>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Courses</th>
                        </tr>
                    </thead>

                    <tbody class="table-group-divider">

                        {totalEnrolledUsers.length ? totalEnrolledUsers.map((u, index) => (

                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{u.UNAME}</td>
                                <td>{u.UEMAIL}</td>
                                <td>{u.UPHONE}</td>
                                <td>{u.CNAME}</td>
                            </tr>

                        )) : <p>Currently no users enrolled to the courses</p>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TotalEnrolledUsers