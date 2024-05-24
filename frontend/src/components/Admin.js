import React, { useEffect, useState } from 'react'
import Validation from './Validations'
import axios from 'axios'

function Admin() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]:[event.target.value]}));
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();

        const err = Validation(values);
        setErrors(err);

        if(err.name === "" && err.email === "" && err.password === "") {
            axios.post('/add_vendor', values)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
        }
    }

    // get all vendors list & users list
    const [vendors, setVendors] = useState('');
    const [users, setUsers] = useState('');

    useEffect(() => {
        const fetchAllVendors = async () => {
            try{
                const res = await axios.get("/vendors")
                // console.log(res.data.data);
                setVendors(res.data.data);
            } catch(err) {
                console.log(err);
            }
        }

        const fetchAllUsers = async () => {
            try{
                const res = await axios.get("/users")
                // console.log(res.data.data);
                setUsers(res.data.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchAllVendors();
        fetchAllUsers();
    }, []);

  return (
    <>

    <div className='d-flex'>
    
    {/* Vendors list */}
    <div className='m-5 bg-light rounded p-3'>
        <h2> # Vendors list</h2>
        {vendors.length ? vendors.map((v) => (
        <div key={v.vid}>
        <table className='table border rounded'>
            <thead>

            <tr className='border'>
                <th>Vendor ID</th>
                <th>Vendor name</th>
                <th>Vendor email</th>
                <th>Vendor phone</th>
                <th>Vendor type</th>
                <th>Option</th>
            </tr>
            </thead>
            <tbody>

            <tr>
                <td>{v.vid}</td>
                <td>{v.vname}</td>
                <td>{v.vemail}</td>
                <td>{v.vphone}</td>
                <td>{v.vtype}</td>
                <td>
                    <div>
                        <button className='text-success border-success rounded'>Edit</button> / 
                        <button className='text-danger border-danger rounded mx-1'>Delete</button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        // console.log(v.vname);
    )) : ""}
    </div>

    {/* Add New Vendor */}
    <div className='d-flex m-5'>
        <div className='bg-light p-3 rounded'>
            <form onSubmit={handleSubmit}>
                <h2> Add New Vendor</h2>
                <div className='mb-3'>
                    <label htmlFor="name">Vendor name</label>
                    <input type="text" name='name' placeholder='Enter vendor name' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.name && <span className='text-danger'> {errors.name}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="email">Vendor email</label>
                    <input type="email" name='email' placeholder='Enter vendor email' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.email && <span className='text-danger'> {errors.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Vendor password</label>
                    <input type="password" name='password' placeholder='Enter vendor password' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.password && <span className='text-danger'> {errors.password}</span>}
                </div>
                <div>
                    <button type='submit' className='btn btn-success w-100 p-2'>Add Vendor</button>
                </div>
            </form>
        </div>
    </div>

    </div>
    {/* Users list */}
    <div className='d-flex'>
        <div className='bg-light p-3 m-5'>

        <h2> # Users list </h2>
            <table className='table border rounded'>
                <thead className='border'>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>User email</th>
                        <th>User phone</th>
                        <th>Options</th>
                    </tr>
                </thead>
        {users ? users.map((u) => (

                <tbody className='border' key={u.uid}>
                    <tr>
                        <td>{u.uid}</td>
                        <td>{u.uname}</td>
                        <td>{u.uemail}</td>
                        <td>{u.uphone}</td>
                        <td>
                            <div>
                                <button className='text-success border-0 rounded'>Edit</button> /
                                <button className='text-danger border-0 rounded mx-1'>Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            
        )): "No data"}
        </table>
        </div>
    </div>

    </>
  )
}

export default Admin