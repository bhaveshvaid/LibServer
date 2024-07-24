const mongoose= require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
    name:String,
    email:{type:String, unique:true},
    password:String,
    memId:{type:String}
},
{
    collection:"UserInfo"
})
mongoose.model("UserInfo", UserDetailsSchema);