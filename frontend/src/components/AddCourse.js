import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AddCourse(props) {

    // categories for dropdown
    const [category, setCategory] = useState({})
    const [selectedCategory, setSelectedCategory] = useState('IT')

    // course variables
    const [cname, setCname] = useState('')
    const [cdescription, setCdescription] = useState('')
    // const [ccategory, setCcategory] = useState('')
    const [cduration, setCduration] = useState('')
    const [cfee, setCfee] = useState('')
    const [cimage, setCimage] = useState('')

    // batch variables
    const [bcapacity, setBcapacity] = useState('')
    const [bintime, setBintime] = useState('')
    const [bouttime, setBouttime] = useState('')

    // syllabus variables
    const [syllabus, setSyllabus] = useState([
        {topic: ''},
    ])

        const [message, setMessage] = useState('')

        const uploadData = async () => {
            const formData = new FormData();
            formData.append('cname', cname);
            formData.append('cdescription', cdescription);
            formData.append('ccategory', selectedCategory);
            formData.append('cduration', cduration);
            formData.append('cfee', cfee);
            formData.append('cimage', cimage);
            formData.append('cvid', props.vendorId.current);


            formData.append('bcapacity', bcapacity)
            formData.append('bintime', bintime)
            formData.append('bouttime', bouttime)

            formData.append('syllabus', JSON.stringify(newArray))


            
            // console.log("formdata below");
            // console.log("formdata", formData, formData.get('cname'));

            const res = await axios.post("courses/add", formData, {
                headers: {'Content-Type':'multipart/form-data'},
            })
            // .then(res => console.log(res))
            // .catch(err => console.log(err))

            if(res.data.success) {
                setMessage(res.data.success);
                setTimeout(() => {
                    
                }, 2000);
            }
        }

        const handleSubmit = async (event) => {
            event.preventDefault();
            await uploadData();
        }

        // add syllabus fields
        const handleAddFields = () => {
            let object = {topic: ''}
            setSyllabus([...syllabus, object])
        }
        // remove syllabus fields
        const handleRemoveField = (index) => {
            let data = [...syllabus]
            data.splice(index, 1)
            setSyllabus(data)
        }

        // syllabus onchange
        const handleSyllabusOnChange = (event, index) => {
            // console.log(index, event.target.name, event.target.value)
            let data = [...syllabus]
            data[index][event.target.name] = event.target.value
            setSyllabus(data)
        }

        // console.log(syllabus)
        // console.log("Addcourse", localStorage.getItem("vendor_token"))
        // console.log("CVID in AddCourse page ", props.vendorId.current);
    
        useEffect(() => {

            // get all categories
            const fetchAllCategories = async () => {
                try {
                    const res = await axios('category')
                    // console.log(res.data)
                    setCategory(res.data)
                } catch(err) {
                    console.log(err)
                }
            }

            fetchAllCategories();
            // eslint-disable-next-line
        }, [])

        // console.log("Syllabus in AddCourse page ", syllabus, "\n", syllabus.length);
        let newArray = syllabus.map(element => element.topic)
        // console.log(newArray)

  return (
    <div className='d-flex justify-content-center align-items-center bg-light'>
        <div className='bg-white p-3 rounded'>
            {message ? message : ""}
            <form action="" onSubmit={handleSubmit}>
                <h2>Add Course</h2>
                <div className='mb-3'>
                    <label htmlFor='cname'> Course name: </label>
                    <input type="text" placeholder='Enter course name' name='cname' className='form-control rounded-0' onChange={(e)=>setCname(e.target.value)} required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cdescription'> Course description: </label>
                    <input type="text" placeholder='Enter course description' name='cdescription' className='form-control rounded-0' onChange={(e)=>setCdescription(e.target.value)} required/>
                </div>
                {/* <div className='mb-3'>
                    <label htmlFor='ccategory'> Course category: </label>
                    <input type="text" placeholder='Enter course category' name='ccategory' className='form-control rounded-0' onChange={(e)=>setCcategory(e.target.value)}/>
                </div> */}
                <div className='mb-3'>
                <label htmlFor='ccategory'> Course category: </label>
                <select name="ccategory" onChange={(e) => {setSelectedCategory(e.target.value)}} className='form-control'>
                    {category.length ? (category.map((c) =>(
                        <option key={c.cid} value={c.ccategory}>{c.ccategory}</option>
                    ))): (<option value="none">Select Category</option>)}
                </select>

                </div>
                <div className='mb-3'>
                    <label htmlFor='cduration'> Course duration: </label>
                    <input type="text" placeholder='Enter course duration' name='cduration' className='form-control rounded-0' onChange={(e)=>setCduration(e.target.value)} required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cfee'> Course fee: </label>
                    <input type="number" placeholder='Enter course fee' name='cfee' className='form-control rounded-0' onChange={(e)=>setCfee(e.target.value)} required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cimage'> Course image: </label>
                    <input type="file" placeholder='Enter course image' name='cimage' className='form-control rounded-0' onChange={(e)=>setCimage(e.target.files[0])}/>
                </div>

                {/* batch */}
                <div className='d-flex'>

                <div>
                    <label htmlFor='bcapacity'> Batch capacity: </label>
                    <input type="number" placeholder='Enter batch capacity' name='bcapacity' className='form-control rounded-0' onChange={(e)=>setBcapacity(e.target.value)} required/>
                </div>
                <div className='mx-3 mb-3'>
                    <label htmlFor='in_time'> Batch TimeIn: </label>
                    <input type="datetime-local" placeholder='Enter batch start time' name='in_time' className='form-control rounded-0' onChange={(e)=>setBintime(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor='out_time'> Batch TimeOut: </label>
                    <input type="datetime-local" placeholder='Enter batch end time' name='out_time' className='form-control rounded-0' onChange={(e)=>setBouttime(e.target.value)} required/>
                </div>
                </div>

                {/* syllabus */}
                <div className='mb-3'>
                    <label htmlFor='syllabus'> Syllabus: </label>
                    {syllabus.map((s, index) => {
                        return (

                            <div className='my-2 d-flex align-items-center' key={index}>
                            <p className='mx-3'>{index}</p>
                            <input type="text" placeholder='Enter syllabus topic here' name='topic' value={s.topic} onChange={(event) => handleSyllabusOnChange(event, index)}/>
                            <Link onClick={(index) => handleRemoveField(index)} className='btn text-danger border-danger m-3'>Remove</Link>
                        </div>
                        )
                    })}
                </div>
                <Link onClick={() => handleAddFields()} className='btn text-success border-info mb-4 mx-5'>Add more field</Link>
                
                <button type="submit" className='btn btn-success w-100'>Add Course</button>
            </form>
        </div>
    </div>
  )
}

export default AddCourse