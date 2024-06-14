import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AddCourse from './AddCourse'

function Vendor() {

    const navigate = useNavigate('')

    // let vendorId = 0;
    const vendorId = useRef(0);

    useEffect(() => {
        // vendor authentication
        const handleVendorAuth = async () => {
            try {
                const res = await axios.get('vendors/checkauth', {
                    headers: {
                        "access-token" : localStorage.getItem('vendor_token')
                    }
                })
                // console.log(res.data)
                // const vendorId = res.data.vendor_id;
                vendorId.current = res.data.vendor_id;

                if(res.data.data !== 'Authenticated') {
                    navigate('/vendor_login')
                }
            } catch(err) {
                console.log(err)
            }
        }

        handleVendorAuth();

        // eslint-disable-next-line
    }, [])

    // console.log("CVID in Vendor page ", vendorId);

  return (
    <div>
        <div>
            <AddCourse vendorId = {vendorId}/>
        </div>
    </div>
  )
}

export default Vendor