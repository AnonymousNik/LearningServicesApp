import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name]:[e.target.value]}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('admin', values);
            if(res.data.Login) {
                localStorage.setItem("admin_token", res.data.token);
                navigate('/admin')
            }
        } catch(err) {
            console.log(err);
        }

    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-light'>
        <div className='bg-white p-5 rounded-4 border'>
            <form onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <div className='mb-3'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' placeholder='Enter your email' onChange={handleInput} className='form-control'/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' placeholder='Enter your password' onChange={handleInput} className='form-control'/>
                </div>
                <div className='d-flex justify-content-center'>
                <button type='submit' className='text-success border-success btn px-5'>Login</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AdminLogin