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

    const [courses, setCourses] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {

      const fetchAllCourses = async () => {
        try{
          const res = await axios.get("/courses")
          // console.log(res.data.data);
          setCourses(res.data);
        } catch(err) {
          console.log(err);
        }
      };
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

      fetchAllCourses();
      fetchAllCategories();
    }, []);

    // console.log(courses);

    const [selectedCategory, setSelectedCategory] = useState("All");

    // Grabbing value
    function handleAdd(e) {
      setSelectedCategory(e.target.value);
    }

    // Filtering out array
    // console.log("courses", courses);
    const categoryFilter = courses.filter((value) => {
      if(selectedCategory === "All") {
        return true
      } else {
        // console.log("value.category", value.category, selectedCategory, value.ccategory === selectedCategory);
        return value.ccategory === selectedCategory
      }
    })

    // const img_path = "./public/images/";

    function getImagePath(imgname) {
      console.log("./public/images"+imgname);
      // return "./public/images/"+imgname
      return "C:/Users/'Desktop 007'/Desktop/LearningServicesApp/frontend/public/images/"+imgname
    }

  return (
    <div>
    <Navbar/>
    <div className='Filter px-5 mt-5'> <span className='mx-3'>Filter: </span>
      <select name="filter" onChange={handleAdd}>
        <option value="All"> All</option>
        {category ? category.map((c) => (
          <option key={c.cid} value={c.ccategory} className='bg-light'>{c.ccategory}</option>
        )): "No data"}
      </select>
      {/* <ul>
        {courses ? categoryFilter.map(course => (
        <p>{course.cname}</p>
        
        )): ""}
      </ul> */}
    </div>

    {/* In card form */}
    <div className='p-3 d-flex m-4'>
      {courses.length ? categoryFilter.map((d) => (
        // <div key={d.cid}>
        // const img_src = "./public/images"+{d.cimage}
        <Link to={`/course/${d.cid}`} key={d.cid} style={{textDecoration: "none"}}>
        
          <div className="card m-4" style={{width: "18rem"}}>
            <img className="card-img-top" src={`../images/${d.cimage}`} alt="Card cap"/>
              <div className="card-body">
                <h5 className="card-title">{d.cname}</h5>
                <p className="card-text">{d.cdescription}</p>
                <p className="card-text">{d.cfee}</p>
                <p className="card-text">by {d.vname}</p>
                <Link to={`/course/${d.cid}`} className="btn btn-success">Buy Course</Link>
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