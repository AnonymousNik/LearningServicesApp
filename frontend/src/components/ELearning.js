import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';

function ELearning() {
    const [data, setData] = useState('');
    useEffect(() => {
      fetch('http://localhost:8800/elearning')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
    }, [])
  return (
    <div>
    <Navbar/>
    <div className='p-3 d-flex m-4'>
      {data.map((d) => (
        <div key={d.cid}>
          <div className="card m-4" style={{width: "18rem"}}>
            <img className="card-img-top" src={d.cimage} alt="Card cap"/>
              <div className="card-body">
                <h5 className="card-title">{d.cname}</h5>
                <p className="card-text">{d.cdescription}</p>
                <p className="card-text">{d.cfee}</p>
                <a href="/" className="btn btn-success">Buy Course</a>
              </div>
          </div>
        </div>
      ))}
      </div>
    </div>
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