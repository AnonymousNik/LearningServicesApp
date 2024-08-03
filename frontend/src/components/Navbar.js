import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'


// dotenv.config()

function Navbar() {

  const [authStatus, setAuthStatus] = useState(false);
  const [userid, setUserid] = useState(0)
  const [userName, setUserName] = useState('')
  const [myCourseCount, setMyCourseCount] = useState(0)

  // const navigate = useNavigate()

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

        }

      } catch(err) {
        console.log(err)
      }
    }



    // get user details with UID ( User ID)
    const getUserDetailsByUserId = async (uid) => {

      try {

        const res = await axios.get(`http://localhost:8800/users/${uid}`)

        console.log("User id ", uid)
        console.log("User res data ", res.data, uid)
        // console.log("Username ", res.data[0].UNAME);

        if(res.data.length > 0) {
          var uname = res.data[0].UNAME;
        } else { uname = '';}
        setUserName(uname);
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
        setMyCourseCount(res.data.length)
      } catch(err) {
        console.log(err)
      }
    }

    userAuth();

    getUserDetailsByUserId(userid);
    getEnrolledCoursesByUserId(userid);

    // eslint-disable-next-line
  }, [])

  const handleLogout = () => {
    try{
      localStorage.removeItem('token')
      setAuthStatus(false)
      window.location.reload();
      // navigate('/login')

    } catch(err) {
      console.log(err)
    }
  }

  console.log("user Auth status ", authStatus, userid)

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="/">LearningServices</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/elearning">ELearning</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/services">Services</a>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="/">Action</a>
          <a className="dropdown-item" href="/">Another action</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="/">Something else here</a>
        </div>
      </li>
    </ul>
    <form className="form-inline my-2 my-lg-0 d-flex">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
      <button className="btn btn-outline-success my-2 my-sm-0 m-2" type="submit">Search</button>
    </form>
    {authStatus ? (<button className='btn btn-danger' onClick={handleLogout}>Logout <span> {userName}</span></button>):
    (<Link to = {'/login'} className='btn btn-success'>Login</Link>)
    }
  </div>
  <div className='mx-5'>
    <Link to={'/mycourses'} className='d-flex text-decoration-none text-dark'>My Courses {myCourseCount>0 && <p> ({myCourseCount}) </p>}</Link>
  </div>
</nav>
    </div>
  )
}

export default Navbar