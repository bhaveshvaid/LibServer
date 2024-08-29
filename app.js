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
require("./Announcements")
const User = mongoose.model("UserInfo");
const Announcements = mongoose.model("Announcements")



app.get("/",(req,res)=>{
  // res.writeHead(200, { 'Content-Type':'text/html'});
// res.end();
    res.send("<div> <h1>You have entered the server of LibApp</h1> <br> <h3>This app is designed and developed by <u>Bhavesh Vaid</u> under supervision of Dr. Nabi Hasan and Dr. Mohit Garg</h3> for any further info contact them.</div>")
})
 
app.post("/register", async(req,res)=>{
    const {name, email,password,memId,image}= req.body;

    const oldUser = User.findOne({email:email});
    if(oldUser==email){
        return res.send({data:"User Already Exists"})
    }

    try {
        await User.create({
            name:name,
            email:email,
            password:password,
            memId:memId,
            image:image
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



//announcements update
app.post('/admin/announcements', async (req,res)=>{
        console.log(req.body)
        // res.send('contacted successfully with info -> '+ req.body)
   try {
        const abc = await Announcements.findOne()
        if(!abc){
            await Announcements.create(
                {array: req.body}
            )
            res.send('Created Succesfully')
        }
    else await Announcements.updateOne({array:req.body})
    res.send('Announcements updated sucessfully')
   } catch (error) {
        console.log(error)
        res.send(error)
   }
})

//announcements fetch
app.get('/announcements/get', async (req,res)=>{
   const announcement= await Announcements.findOne()
   console.log(announcement)
   res.send(announcement)
   
})
//Orcid auth worlflow
app.get('/orcid/callback', async (req, res) => {
  const code = req.query.code;

  // Exchange authorization code for access token
  const tokenResponse = await axios.post('https://api.sandbox.orcid.org/oauth/token', {
    client_id: process.env.ORCID_CLIENT_ID,
    client_secret: process.env.ORCID_CLIENT_SECRET,
    code,
    redirect_uri: 'https://lib-server.vercel.app/orcid/callback',
    grant_type: 'authorization_code'
  });

  const accessToken = tokenResponse.data.access_token;


  // Redirect user back to frontend with success message or other data
  res.redirect('libApp://success'); // Replace with your frontend app's custom URL scheme
});

app.listen(PORT, ()=>{
  console.log("Server is listining at port 8080");
});
