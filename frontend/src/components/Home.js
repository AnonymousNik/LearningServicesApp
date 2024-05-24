import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function Home() {
    useEffect(() => {
        fetch('http://localhost:8800/')
        .then(res => res.json())
        .catch(err => console.log(err))
    }, [])
  return (
    <div>
    <Navbar/>
    <div className='d-flex justify-content-center p-5 bg-secondary'>
        <div className='m-4'>
            <Link to={'/elearning'} className='btn btn-success m-4 rounded-5 p-3'>ELearning</Link>
            <Link to={'/services'} className='btn btn-warning m-4 rounded-5 p-3'>Services</Link>
            {/* <button className='btn btn-warning m-4 rounded-5 p-3'>Services</button> */}
        </div>
    </div>
    </div>
  )
}

export default Home