const mongoose= require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    array:Array,
},
{
    collection:"Announcements"
})
mongoose.model("Announcements", AnnouncementSchema);