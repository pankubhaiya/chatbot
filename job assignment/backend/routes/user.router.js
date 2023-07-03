
const express = require("express")
const jwt = require("jsonwebtoken")
const { authorization } = require("../middlewares/auth")
require("dotenv").config()
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const { usermodel } = require("../models/user.Schema")
userRouter.use(express.json())

let GOTP ={}
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'jainpankaj0987@gmail.com',
    pass: process.env.secret_emailkey
  }
});

userRouter.post("/sign", async (req, res) => {
  const { email, name, password } = req.body
  try {
    let presentUser = await usermodel.findOne({ email })

    if (presentUser) {
      res.send("user already present")
    } else {

      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send({ "ok": false, "err": "Something went wrong while hashing" });
        }
        const verificationToken = await jwt.sign({ email }, process.env.JWT_SECRET)
        const user = new usermodel({ name, email, password: hash, verificationToken });
        await user.save();


        // email to verify

        const verificationLink = `http://localhost:9090/user/verifyemail?token=${verificationToken}`;
        const mailOptions = {
          from: 'jainpankaj0987@gmail.com',
          to: email,
          subject: 'Email Verification',
          text: `Click the following link to verify your email:${verificationLink}`
        };


        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.send(error.message)
            // Handle error sending email
          } else {
            console.log('Email sent: ' + info.response);
            res.send({ msg: "email send for verification" })
            // Handle successful email sending
          }
        })
      });
    }


  } catch (err) {
    res.send({ mes: err.message });
  }
})


userRouter.get('/verifyemail', async (req, res) => {
  const token = req.query.token;
  const user = await usermodel.findOne({ verificationToken: token });
  if (user && !user.verified) {
    // Mark the user account as verified in your database
    user.verified = true;
    await user.save()
    res.send('Email verified');
  } else {
    res.send('Invalid or expired verification token');
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });
    // console.log(user);
    if (!user) {
      res.send({ "ok": false, "msg": "User Not found, Please Register First" });
    } else {
      if (user.verified) {

        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "30m",
            });

            res.send({
              "ok": true,
              "mes": "login successfully",
              "user_details": { name: user.name, email: user.email },
              "token": token
            });
          } else {
            res.send({ "ok": false, "msg": "Wrong Credentials" });
          }
        });
      }else{
       res.send({ "ok": false, "msg": "Your email is not verified" });
          
      }
    }
  } catch (err) {
    res.send({ "msg": err.message });
  }
});



userRouter.get("/forgot",async(req,res)=>{
  try{
      const {email} = req.body;
      const isAlreadyRegistered = await usermodel.findOne({email});
      if(isAlreadyRegistered){
          let randomOTP = Math.floor(1000 + Math.random() * 9000);
          GOTP.email = randomOTP;

          const mailOptions = {
            from: 'jainpankaj0987@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `your forgot password otp :${randomOTP}`
          };
  
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
              res.send(error.message)
              // Handle error sending email
            } else {
              console.log('Email sent: ' + info.response);
              res.send({ msg: "send otp your email" })
              // Handle successful email sending
            }
          })
      }else{
          res.status(403).send({isError: true,Msg:"Email is not registered"});
      }
  }catch(err){
      res.status(500).send({isError: true,Msg: err.message});
  }
})
userRouter.post("/updatePassword",async(req,res)=>{
  try{
      const {email,otp,password} = req.body;
      if(GOTP.email == otp){
          let hashedpassword = await bcrypt.hash(password,1);
          await usermodel.findOneAndUpdate({email},{password:hashedpassword})
          res.status(403).send({isError: false,Msg:"update registered"});
      }else{
          res.status(403).send({isError: true,Msg:"otp is not valid"});
      }
  }catch(err){
      res.status(500).send({isError: true,Msg: err.message});
  }
})


module.exports = { userRouter }