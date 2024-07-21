import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

function Navbar(props) {

  const [authStatus, setAuthStatus] = useState(false);
  const [userid, setUserid] = useState('')
  const [userName, setUserName] = useState('')

  // const navigate = useNavigate()

  useEffect(() => {

    console.log(props.userid, props)
    if(props.userid) {
      setUserid(props.userid)
      setAuthStatus(true)
    }


    // get user details with UID ( User ID)
    const getUserDetailsByUserId = async () => {

      try {

        const res = await axios.get(`http://localhost:8800/users/${userid}`)
        // console.log(res)
        // console.log("Username ", res.data.data[0].UNAME);
        if(res.data) {
          var uname = res.data.data[0].UNAME;
        } else { uname = 'User';}
        setUserName(uname);
      } catch(err) {
        console.log(err)
      }
    }

    // get enrolled courses by user id
    const getEnrolledCoursesByUserId = async () => {
      try{
        console.log("User id in endrolled course ", userid)
        const res = await axios.get(`http://localhost:8800/enrolled/u/${userid}`)
  
        console.log(res.data)
      } catch(err) {
        console.log(err)
      }
    }

    getUserDetailsByUserId();
    getEnrolledCoursesByUserId();

    // eslint-disable-next-line
  }, [])

  const handleLogout = () => {
    try{
      localStorage.removeItem('token')
      window.location.reload();
      // navigate('/login')
    } catch(err) {
      console.log(err)
    }
  }

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
    {authStatus ? (<button className='btn btn-danger' onClick={handleLogout}>Logout <span>({userName})</span></button>):
    (<Link to = {'/login'} className='btn btn-success'>Login</Link>)
    }
  </div>
  <div className='mx-5'>
    <span>My Courses</span>
  </div>
</nav>
    </div>
  )
}

export default Navbar