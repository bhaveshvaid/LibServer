const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors'); // For handling Cross-Origin requests
const jwt = require('jsonwebtoken'); // For generating JWTs

require('dotenv').config()
app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGO_URL
const PORT = process.env.PORT_NUMBER

// console.log(MONGO_URL)

mongoose.connect(mongoUrl).then(()=>{
    console.log("Database Connected");
}).catch(error=>{
    console.log(error);
})
require("./UserDetails")
const User = mongoose.model("UserInfo");
 
app.get("/",(req,res)=>{
    res.send("got the request")
})
 
app.post("/register", async(req,res)=>{
    const {name, email,password}= req.body;

    const oldUser = User.findOne({email:email});
    if(oldUser==email){
        return res.send({data:"User Already Exists"})
    }

    try {
        await User.create({
            name:name,
            email:email,
            password:password
        });
        res.send({status:"ok", data:"User Sucesfully Created"})
    } catch (error) {
        res.send({status:"error", data:error})
    }
})

//login api
app.post("/login", async(req,res)=>{
    const {email,password}= req.body;

    try {
        const existingUser = await User.findOne({ email});
        
        console.log(existingUser)

        if (!existingUser) {
            res.send({data:"user doesnt exist"})
            throw new Error('Invalid email or password');
            }
            // const isMatch =false
            // console.log("password: "+password +" User fetched password: "+ existingUser.password)
            if(existingUser.password == password){
                res.send({status:"ok", data:"User Sucesfully Authenticated", shouldLog:true, user:existingUser})
                }
   
    } catch (error) {
        res.send({status:"error", data:error, shouldLog:false})
    }
})


app.listen(PORT, ()=>{
    console.log("Server is listining at port 8080");
});