import axios from 'axios'
import Navbar from './Navbar';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';

function MyCourses() {

    const [authStatus, setAuthStatus] = useState(false);

    const [userid, setUserid] = useState(0)

    const [myCourses, setMyCourses] = useState()

    const path = "C:/Users/Desktop 007/Desktop/N/LearningServicesApp/frontend/public/images/";
    // const path = window.location.location;

    useEffect(() => {

        const userAuth = async () => {
          try {
            const res = await axios.request({
              method: "POST",
              url: `http://localhost:8800/users/checkauth`,
              headers: {"access-token": localStorage.getItem("token")}
            })
    
          //   console.log("User auth res ", res)
            if(res.data.auth_status === "Authenticated") {
              setAuthStatus(true)
              setUserid(res.data.userid)
    
            } else {
              alert("Please logged in to see your enrolled courses")
            }
    
          } catch(err) {
            console.log(err)
          }
        }
    
    
    
        // get enrolled courses by user id
        const getEnrolledCoursesByUserId = async (uid) => {
          try{
            console.log("User id in endrolled course ", uid)
            const res = await axios.get(`http://localhost:8800/enrolled/u/${uid}`)
      
            console.log("Navbar.js getEnrolledCoursesByUserId ", res.data)
            setMyCourses(res.data)
          } catch(err) {
            console.log(err)
          }
        }
    
        userAuth();
    
        getEnrolledCoursesByUserId(userid);
    
        // eslint-disable-next-line
      }, [])
  return (
    <div>

        <Navbar />
    <div>
        <h1>MyCourses</h1>
        {(myCourses && myCourses.length>0) ? myCourses.map((c)=>(
            <Card style={{width:"18rem"}}>
                <Card.Img variant="top" src={path + c.CIMAGE} alt={c.CNAME + " image"}/>
                {/* C:\Users\Desktop 007\Desktop\N\LearningServicesApp\frontend\public\images\1722332482067_dbms.png */}
                {console.log(path + c.CIMAGE)}
                <Card.Body>
                <Card.Title>{c.CNAME}</Card.Title>
                <Card.Text>{c.CDESCRIPTION}</Card.Text>
                </Card.Body>

            </Card>
            )):"No data"}
    </div>
    </div>
  )
}

export default MyCourses