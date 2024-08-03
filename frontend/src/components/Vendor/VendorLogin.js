import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function VendorLogin() {

    const [values, setValues] = useState({email: '', password: ''})

    const navigate = useNavigate()
    
    
    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name]:[e.target.value]}))
    }
    
    // console.log(values)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('vendors/login', values)
            if(res.data.Login) {
                localStorage.setItem("vendor_token", res.data.token)
                navigate('/vendor')
            }
            console.log(res)
        } catch(err) {
            console.log(err)
        }
    }
  return (
    <div className='d-flex align-items-center justify-content-center bg-light vh-100'>
        <div className='mt-5 bg-white p-5 rounded-5'>
            <form onSubmit={handleSubmit}>

                <h2 className='mb-3'>Vendor Login</h2>
                <div className='mb-3'>
                    <label htmlFor="email">Vendor email</label>
                    <input type="email" placeholder='Enter your email' name='email' className='form-control' onChange={handleInput}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Vendor password</label>
                    <input type="password" placeholder='Enter your password' name='password' className='form-control' onChange={handleInput}/>
                </div>
                <button type='submit' className='text-success rounded-1 bg-light border-white mx-5'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default VendorLogin