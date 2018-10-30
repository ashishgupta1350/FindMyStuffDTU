var mongoose=require("mongoose");

var foundItemsSchema=new mongoose.Schema({
    item:String,
    details:String,
    specifications:String,
    date:String,
    time:String,
    image:
    {
        type:String,
        default:"https://res.cloudinary.com/ashishgupta/image/upload/c_scale,w_517/v1540897040/Vow_Renewal_Ceremony.png"
    },
    location: String,
    lat: Number,
    lng: Number,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    isFoundByDTUSecurity:{
        default:false,
        type: Boolean
    }
}); 
var FoundItem= mongoose.model("FoundItem",foundItemsSchema);

module.exports = FoundItem;
