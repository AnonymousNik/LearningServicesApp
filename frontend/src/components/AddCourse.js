import axios from 'axios'
import React, { useState } from 'react'

function AddCourse() {

    // let formData = new FormData();
    
    // const [courseValues, setCourseValues] = useState({
    //     cname: "",
    //     cdescription: "",
    //     ccategory: "",
    //     cduration: "",
    //     cfee: "",
    //     cimage: null
    // })

    // const handleCourseInput = (event) => {
    //     setCourseValues(prev => ({...prev, [event.target.name]:[event.target.value]}))
    //     formData.append(event.target.name, event.target.value);
    // }

    // const [image, setImage] = useState({cimage: null})

    // const handleImageInput = (event) => {
    //     console.log(event.target.files[0]);
    //     // setCourseValues({cimage:event.target.files[0]});
    //     formData.append('cimage', event.target.files[0]);
    // }
    
    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     await axios({
    //         url: "/courses/add",
    //         method: 'POST',
    //         data: formData
    //     }) .then(res => console.log(res),
    // console.log(formData))
    //     .catch(err => console.log(err))

        // await axios.post("/courses/add", courseValues)
        // .then(res => {
        //     console.log(res);
        // })
        // .catch(err => {
        //     console.log(err);
        // })
    // }

        const [cname, setCname] = useState('')
        const [cdescription, setCdescription] = useState('')
        const [ccategory, setCcategory] = useState('')
        const [cduration, setCduration] = useState('')
        const [cfee, setCfee] = useState('')
        const [cimage, setCimage] = useState('')

        const [message, setMessage] = useState('')

        const uploadData = async () => {
            const formData = new FormData();
            formData.append('cname', cname);
            formData.append('cdescription', cdescription);
            formData.append('ccategory', ccategory);
            formData.append('cduration', cduration);
            formData.append('cfee', cfee);
            formData.append('cimage', cimage);


            
            // console.log("formdata below");
            // console.log("formdata", formData, formData.get('cname'));

            const res = await axios.post("/courses/add", formData, {
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
    

  return (
    <div className='d-flex justify-content-center align-items-center bg-light vh-100'>
        <div className='bg-white p-3 rounded w-25'>
            <form action="" onSubmit={handleSubmit}>
                <h2>Add Course</h2>
                <div className='mb-3'>
                    <label htmlFor='cname'> Course name: </label>
                    <input type="text" placeholder='Enter course name' name='cname' className='form-control rounded-0' onChange={(e)=>setCname(e.target.value)}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cdescription'> Course description: </label>
                    <input type="text" placeholder='Enter course description' name='cdescription' className='form-control rounded-0' onChange={(e)=>setCdescription(e.target.value)}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='ccategory'> Course category: </label>
                    <input type="text" placeholder='Enter course category' name='ccategory' className='form-control rounded-0' onChange={(e)=>setCcategory(e.target.value)}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cduration'> Course duration: </label>
                    <input type="text" placeholder='Enter course duration' name='cduration' className='form-control rounded-0' onChange={(e)=>setCduration(e.target.value)}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cfee'> Course fee: </label>
                    <input type="number" placeholder='Enter course fee' name='cfee' className='form-control rounded-0' onChange={(e)=>setCfee(e.target.value)}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='cimage'> Course image: </label>
                    <input type="file" placeholder='Enter course image' name='cimage' className='form-control rounded-0' onChange={(e)=>setCimage(e.target.files[0])}/>
                </div>

                <button type="submit" className='btn btn-success w-100'>Add Course</button>
            </form>
        </div>
    </div>
  )
}

export default AddCourse