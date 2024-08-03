import express from "express"
import db from "../db.js"
import jwt from "jsonwebtoken"
// require("dotenv").config()
import * as dotenv from "dotenv"

import nodemailer from "nodemailer"
import Mailgen from "mailgen"

dotenv.config()

const router = express.Router()
const app = express()

app.locals.otp = Math.floor(100000 + Math.random() * 900000);

// GET USERS
router.get("/", (req, res) => {
    const q = "SELECT * FROM USER";

    db.query(q, (err, data) => {
        if(err) return res.json({ error: err });
        return res.json({ data: data });
    })
})

// GET USER WITH UID( USER ID )
router.get('/:id', (req, res) => {
    const q = 'SELECT * FROM USER WHERE UID LIKE ?';

    db.query(q, [req.params.id], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// verify user with jwt token created while login
const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    // const token = req.body.token;
    // console.log("Inside verifyjwt token ", token)
    
    if(!token) {
        res.json("Need a token")
    } else {
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
            if(err) res.json({error: "Not authenticated", err})
            else {
                req.uid = decoded.id;
                next();
            }
        })
    }
}

// to check user authentication URL: http://localhost:8800/users/checkauth
router.post("/checkauth", verifyJwt, (req, res) => {
    // console.log("Check auth requested with user id ", req.uid);
    return res.json({auth_status: "Authenticated", userid: req.uid});
})

// LOGIN URL: http://localhost:8800/users/login
router.post("/login", (req, res) => {
    const q = "SELECT * FROM USER WHERE UEMAIL LIKE ?  AND UPASSWORD LIKE ?";

    db.query(q, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json(err);

        if(data.length > 0) {
            const id = data[0].UID;
            // console.log("User id: ",id, "jwt secret key: ", process.env.REACT_APP_JWT_SECRET, data);

            const token = jwt.sign({ id }, process.env.REACT_APP_JWT_SECRET, { expiresIn: '1h' })
            return res.json({ Login: true, token, data });
        } else {
            return res.json("User login Failure");
        }
    })
})

// SIGN UP
router.post("/signup", (req, res) => {

    // check if user email already exists or not
    db.query("SELECT COUNT(*) AS CNT FROM USER WHERE UEMAIL=?", req.body.email, (err, data) => {
        if(err) return res.json({ error: err });

        // console.log(data[0].CNT, req.body.email);
        if(data[0].CNT > 0) {
            return res.status(400).json({ error: "User already exists" })
        }
        // if user email does not exists then insert new user
        else {

            // let otp = Math.floor(100000 + Math.random() * 900000);

            // send otp to the user email
            let otp_sent_status = signup(req.body.name, req.body.email, app.locals.otp);


            if(otp_sent_status) {
                console.log("OTP SENT SUCCESSFULY");
            }

            const q = "INSERT INTO USER (UNAME, UEMAIL, UPHONE, UPASSWORD) VALUES (?)";
            const values = [
                req.body.name,
                req.body.email,
                req.body.phone,
                req.body.password
            ]

            console.log("INside signup backend ", otp_sent_status, app.locals.otp, req.body.phone, values)
            
            db.query(q, [values], (err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            })
        }
    })

})

router.post('/verifyotp', (req, res) => {
    try {
        // console.log("INSIDE verifyOtp backend ", req.body.otp, req.body.email, app.locals.otp, req.body)
        if(req.body.otp == app.locals.otp) {
            const q = "UPDATE USER SET VERIFIED=1 WHERE UEMAIL=?";
            db.query(q, [req.body.email], (err, data) => {
                if(err) return res.json(err)
                return res.json(data)
            })
        }
    } catch (err) {
        console.log(err)
    }
})

const signup = async (user_name, user_email, otp) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "LearningServices Team",
                link: "http://localhost:3000/"
            }
        })

        let response = {
            body: {
                name: user_name,
                intro: "Thank you for registering with LearningServices",
                table: {
                    data: [
                        {
                            "#": "Your OTP: ",
                            Code: otp
                        }
                    ]
                },
                outro: "Looking forward to do more business",
            }
        }

        let mail = MailGenerator.generate(response)

        let message = {
            from: '"LearningServices Team 📩" <Learningservices@gmail.com>',
            to: user_email,
            subject: "Your OTP for LearningServices ... ",
            html: mail
        }

        transporter.sendMail(message).then(() => {
            return true
        }).catch(err => {
            console.log(err);
            return false
        })

    } catch (err) {
        console.log(err)
    }
    // async..await is not allowed in global scope, must use a wrapper
    //     async function main() {
    //         // send mail with defined transport object
    //         const info = await transporter.sendMail({
    //         from: '"LearningServices Team 📩" <Learningservices@gmail.com>', // sender address
    //         to: "jaryn.sanav@floodouts.com", // list of receivers
    //         subject: "Hello ✔", // Subject line
    //         text: "Hello world?", // plain text body
    //         html: "<b>Hello world?</b>", // html body
    //         });

    //     console.log("Message sent: %s", info.messageId);
    //     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    //   }

    //   main().catch(console.error);

}

export default router