import React, { useEffect, useState } from 'react'
import Validation from './Validations'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Popup from "reactjs-popup"

function Admin() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone:'',
        password: '',
        type: 'eVendor'
    })

    // get all vendors list & users list
    const [vendors, setVendors] = useState('');
    const [users, setUsers] = useState('');
    const [courses, setCourses] = useState('');

    const navigate = useNavigate()

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]:[event.target.value]}));
    }
    
    const handleAddVendor = async (event) => {
        try {

            event.preventDefault();
            
            const err = Validation(values);
            setErrors(err);
            
            // vendor validations
            if(err.name === "" && err.email === "" && err.password === "") {
                const res = await axios.post('vendors/add_vendor', values)
                window.location.reload();
                console.log(res.data)
                if(res.data === "Vendor already exists") alert("Vendor already exists");
            }
        } catch(err) {
            console.log(err);
        }
    }

    // delete vendor by id
    const handleDeleteVendorById = async (vendor_id) => {
        try{
            if(vendor_id > 0) {
                if(window.confirm(`Please confirm to delete the vendor? (vid = ${vendor_id})`)){
                    // to refresh vendor list if any vendor has been deleted
                    const v = vendors.filter(item => item.vid !== vendor_id);
                    setVendors(v);
                    
                    // console.log(vendors, vendors.vid)
                    const res = await axios.delete(`vendors/delete/${vendor_id}`)
                    console.log(res)
                }
            }

        } catch(err) {
            console.log(err);
        }
    }

    // get courselist by vendor
    const handleCoursePerVendor = async (vendor_id) => {
        try {
            const res = await axios.get(`courses/v/${vendor_id}`)
            setCourses(res.data)
            // console.log(res.data)

        } catch(err) {
            console.log(err);
        }
    }



    useEffect(() => {
        // get all vendors list
        const fetchAllVendors = async () => {
            try{
                const res = await axios.get("vendors")
                // console.log(res.data.data);
                setVendors(res.data.data);
            } catch(err) {
                console.log(err);
            }
        }

        // get all users list
        const fetchAllUsers = async () => {
            try{
                const res = await axios.get("users")
                // console.log(res.data.data);
                setUsers(res.data.data);
            } catch(err) {
                console.log(err);
            }
        }

        // verify admin auth
        const handleAdminAuth = async () => {
            try {
                const res = await axios.get('admin/checkauth', {
                    headers: {
                        'access-token': localStorage.getItem('admin_token')
                    }
                })
                console.log(res.data)
                if(res.data !== 'Authenticated'){
                    navigate('/admin_login')
                }
            } catch(err) {
                console.log(err)
            }
        }

        handleAdminAuth();
        fetchAllVendors();
        fetchAllUsers();
        // eslint-disable-next-line
    }, []);

  return (
    <>

    <div className='d-flex'>
    
    {/* Vendor list */}
    <div className='m-5 bg-light rounded p-3'>
        <h2> # Vendor list</h2>
        <table className='table border rounded'>
            <thead>

            <tr className='border'>
                <th>Vendor ID</th>
                <th>Vendor name</th>
                <th>Vendor email</th>
                <th>Vendor phone</th>
                <th>Vendor type</th>
                <th>Courses</th>
                <th>Option</th>
            </tr>
            </thead>
        {vendors.length ? vendors.map((v) => (
            <tbody key={v.VID}>

            <tr>
                <td>{v.VID}</td>
                <td>{v.VNAME}</td>
                <td>{v.VEMAIL}</td>
                <td>{v.VPHONE}</td>
                <td>{v.VTYPE}</td>
                <Popup trigger={<div><button className='btn border-primary' onClick={() =>{handleCoursePerVendor(v.vid)}}>Courses</button></div>}
                        position={"right center"}>
                            <div className='bg-light p-4 rounded-2 align-items-left justify-content-left'>
                                <p className='btn border-success bg-white'>{courses.length ? courses.map((c) => (<p><b>Course name:</b> {c.cname} | <b>fee:</b>  {c.cfee} | <b>duration:</b>  {c.cduration} | <b>category:</b>  {c.ccategory}</p>)):"No courses added"}</p>
                            </div>
                        </Popup>
                <td>
                    <div>
                        <button className='text-success border-success rounded'>Edit</button> / 
                        <button className='text-danger border-danger rounded mx-1' onClick={() => {handleDeleteVendorById(v.vid)}}>Delete</button>
                    </div>
                </td>
            </tr>
            </tbody>
        // console.log(v.vname);
        )) : ""}
        </table>
    </div>

    {/* Add New Vendor */}
    <div className='d-flex m-5'>
        <div className='bg-light p-3 rounded'>
            <form onSubmit={handleAddVendor}>
                <h2> Add New Vendor</h2>
                <div className='mb-3'>
                    <label htmlFor="name">Vendor name</label>
                    <input type="text" name='name' placeholder='Enter vendor name' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.name && <span className='text-danger'> {errors.name}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="email">Vendor email</label>
                    <input type="email" name='email' placeholder='Enter vendor email' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.email && <span className='text-danger'> {errors.email} {console.log(values)}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="phone">Vendor phone</label>
                    <input type="number" name='phone' placeholder='Enter vendor phone' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.phone && <span className='text-danger'> {errors.phone}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Vendor password</label>
                    <input type="password" name='password' placeholder='Enter vendor password' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.password && <span className='text-danger'> {errors.password}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="type">Vendor type</label>
                    <select name="type" onChange={handleInput} className='form-control'>
                        <option value="eVendor">eVendor</option>
                        <option value="sVendor">sVendor</option>
                    </select>
                </div>
                <div>
                    <button type='submit' className='btn btn-success w-100 p-2'>Add Vendor</button>
                </div>
            </form>
        </div>
    </div>

    </div>
    {/* User list */}
    <div className='d-flex'>
        <div className='bg-light p-3 m-5'>

        <h2> # User list </h2>
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
                        <td>{u.UID}</td>
                        <td>{u.UNAME}</td>
                        <td>{u.UEMAIL}</td>
                        <td>{u.UPHONE}</td>
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