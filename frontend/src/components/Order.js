import axios from 'axios';
import React, { useState } from 'react'

function Order() {

    const [responseId, setResponseId] = useState('');

    const [responseState, setResponseState] = useState('');

    const loadscript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src = src;

            script.onload = () => {
                resolve(true)
            }

            script.onerror = () => {
                resolve(false)
            }

            document.body.appendChild(script);
        })
    }

    const createRazorpayOrder = async (amount) => {
        let data = JSON.stringify({
            amount: amount * 100,
            currency: "INR"
        })

        let config = {
            method: "POST",
            maxBodyLength: Infinity,
            url: `http://localhost:8800/orders`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }

        try {
            const res = await axios.request(config)
            handleRazorpayScreen(res.data.amount)

            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    const handleRazorpayScreen = async (amount) => {
        const res = await loadscript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            alert("Some error at razorpay screen loading")
            return;
        }

        const options = {
            key: "rzp_test_WHaF5I8GKfCFsd",
            amount: amount,
            currency: "INR",
            name: "LearningServices",
            description: "Payment to LearningServices",
            image: "https://cdn.vectorstock.com/i/1000v/72/15/child-home-learning-logo-design-learn-online-vector-30927215.jpg",
            handler: function (response) {
                setResponseId(response.razorpay_payment_id)
            },
            prefill: {
                name: "LearningServices",
                email: "nikhil.mohite.nm1+learningservices@gmail.com"
            },
            theme: {
                color: "#F4C430"
            }
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }
    const paymentFetch = async (e) => {
        e.preventDefault();

        try {

            const paymentId = e.target.paymentId.value;

            const res = await axios.get(`http://localhost:8800/payment/${paymentId}`)

            console.log(res.data)
            setResponseState(res.data)
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className='d-flex flex-column align-items-center justify-content-center m-5 p-5'>

            <button onClick={() => createRazorpayOrder(100)}>Payment of Rs. 100 /-</button>
            {responseId && <p>{responseId}</p>}
            <h1 className='my-3'>Please verify payment below</h1>
            <form onSubmit={paymentFetch}>
                <input type="text" name='paymentId' />
                <button type='submit'>Fetch payment</button>
            </form>
            {responseState && 
            (<div>{
                <ul  className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className='text-success my-4 p-2'>Payment verified successfully</h2>

            <i>

            <li>status: {responseState.status}</li>
                <li>method: {responseState.method}</li>
                <li>amount: {responseState.amount}</li>
                <li>currency: {responseState.currency}</li>
            </i>
        </ul>
        }</div>)}
        </div>
    )
}

export default Order