import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './Validations'
import axios from 'axios'

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]:[event.target.value]}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values); 
        setErrors(err);

        if(err.email === "" && err.password === "") {
            axios.post('http://localhost:8800/login', values)
            .then(res => {
                if(res.data === "Success") {
                    navigate('/elearning');
                    console.log(res.data);
                } else {
                    console.log(res.data);
                    alert("Incorrect email and password");
                }
            })
            .catch(err => console.log(err));
        }
    }
  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
            <form action="" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder='Enter your email address' name = 'email' className='form-control rounded-0' onChange={handleInput}/>
                    {errors.email && <span className='text-danger'> {errors.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter your password' name = 'password' className='form-control rounded-0' onChange={handleInput}/>
                    {errors.password && <span className='text-danger'> {errors.password}</span>}
                </div>
                <button type='submit' className='btn btn-success w-100'>Login</button>
                <a href="/" className='d-flex justify-content-center'><span>Forgot Password?</span></a>
                <Link to={'/signup'} className='btn btn-success border w-100 rounded-0 mt-3'>Sign Up</Link>
            </form>
        </div>
    </div>
  )
}

export default Login