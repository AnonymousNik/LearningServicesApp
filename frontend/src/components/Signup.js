import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './Validations'
import axios from "axios"

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]:[event.target.value]}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const err = Validation(values);
        setErrors(err);

        if(err.name === "" && err.email === "" && err.password === "") {
            axios.post('http://localhost:8800/signup', values)
            .then(res => {
                navigate('/');
                console.log(res);
            })
            .catch(err => console.log(err));
        }

    }
  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
    <div className='bg-white p-3 rounded w-25'>
        <form action="" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div className='mb-3'>
                <label htmlFor="name"><strong>Name</strong></label>
                <input type="text" placeholder='Enter your name' name='name' onChange={handleInput} className='form-control rounded-0'/>
                {errors.name && <span className='text-danger'> {errors.name}</span>}
            </div>
            <div className='mb-3'>
                <label htmlFor="email"><strong>Email</strong></label>
                <input type="email" placeholder='Enter your email address' name='email' onChange={handleInput} className='form-control rounded-0'/>
                {errors.email && <span className='text-danger'> {errors.email}</span>}
            </div>
            <div className='mb-3'>
                <label htmlFor="password"><strong>Password</strong></label>
                <input type="password" placeholder='Enter your password' name='password' onChange={handleInput} className='form-control rounded-0'/>
                {errors.password && <span className='text-danger'> {errors.password}</span>}
            </div>
            <button type='submit' className='btn btn-success w-100'>Sign Up</button>
            <Link to={'/login'} className='btn btn-success border w-100 rounded-0 mt-3'>Login</Link>
        </form>
    </div>
</div>
  )
}

export default Signup