import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ELearning() {
    // const [data, setData] = useState('');
    // useEffect(() => {
    //   fetch('/courses')
    //   .then(res => res.json())
    //   .then(data => setData(data))
    //   .catch(err => console.log(err));
    // }, [])
    // console.log(data);

    const [userid, setUserid] = useState('')

    const [courses, setCourses] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {

      // get all courses
      const fetchAllCourses = async () => {
        try{
          const res = await axios.get("/courses")
          // console.log(res.data.data);
          setCourses(res.data);
        } catch(err) {
          console.log(err);
        }
      };

      // get all categories
      const fetchAllCategories = async () => {
        try{
          const res = await axios("/category")
          // console.log(res.data);
          setCategory(res.data);
          // console.log(category[1].ccategory);
        } catch(err) {
          console.log(err);
        }
      }

      // check user authentication
      const handleAuth = async () => {
        try {
          const res = await axios.get('http://localhost:8800/users/checkauth', {
            headers: {
              'access-token': localStorage.getItem('token')
            }
          })
          // console.log("Navbar res ", res.status);
          if(res.data.status === 'Authenticated' || res.status === 200){
            // setAuthStatus(true);
            console.log("res data learning ", res.data)
            setUserid(res.data.userid);
          }
  
        } catch(err) {
          console.log(err);
        }
      }

      fetchAllCourses();
      fetchAllCategories();
      handleAuth()
    }, []);

    // console.log('Courses ', courses);

    const [selectedCategory, setSelectedCategory] = useState("All");

    // Grabbing value
    function handleAdd(e) {
      setSelectedCategory(e.target.value);
    }

    // Filtering out array
    const categoryFilter = courses.filter((value) => {
      if(selectedCategory === "All") {
        return true
      } else {
        // console.log("value.category", value.category, selectedCategory, value.ccategory === selectedCategory);
        return value.CCATEGORY === selectedCategory
      }
    })


    console.log("Elearning userid ", userid)
    console.log("Elearning courses ", courses)
  return (
    <div>
    <Navbar userid={userid}/>
    <div className='Filter px-5 mt-5'> <span className='mx-3'>Filter: </span>
      <select name="filter" onChange={handleAdd}>
        <option value="All"> All</option>
        {category ? category.map((c) => (
          <option key={c.cid} value={c.CCATEGORY} className='bg-light'>{c.CCATEGORY}</option>
        )): "No data"}
      </select>
      {/* <ul>
        {courses ? categoryFilter.map(course => (
        <p>{course.cname}</p>
        
        )): ""}
      </ul> */}
    </div>

    {/* In card form */}
    <div className='p-3 d-flex m-4 bg-light border border-5 rounded-4'>
      {courses.length ? categoryFilter.map((d) => (
        // <div key={d.cid}>
        // const img_src = "./public/images"+{d.cimage}
        <Link to={`/course/${d.CID}`} key={d.CID} style={{textDecoration: "none"}}>
        
          <div className="card m-4 p-2" style={{width: "18rem"}}>
            <img className="card-img-top" src={`../images/${d.CIMAGE}`} alt="Card cap"/>
              <div className="card-body">
                <h5 className="card-title">{d.CNAME}</h5>
                <p className="card-text">{d.CDESCRIPTION}</p>
                <p className="card-text">{d.CFEE}</p>
                <p className="card-text">by {d.VNAME}</p>
                <Link to={`/course/${d.CID}`} className="btn btn-success">Buy Course</Link>
              </div>
          </div>
          </Link>
        // </div>
      )) :  <p>No data</p>}
      </div>
    </div>
  // In table form
  //   <div style={{padding: "50px"}}>
  //   <table className='table'>
  //     <thead style={{padding: "50px"}}>
  //       <th>ID</th>
  //       <th>Course Name</th>
  //       <th>Course Description</th>
  //       <th>Course Fee</th>
  //       <th>Course Image Link</th>
  //     </thead>
  //     <tbody style={{padding: "50px"}}>
  //       {data.map((d, i) => (
  //         <tr key={i}>
  //           <td >{d.cid}</td>
  //           <td>{d.cname}</td>
  //           <td>{d.cdescription}</td>
  //           <td>{d.cfee}</td>
  //           <td>{d.cimage}</td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // </div>
  )
}

export default ELearning