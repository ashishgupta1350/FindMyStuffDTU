var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var pasportLocal=require("passport-local");

var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{type:Boolean,default:false},
    avatar:{type:String,default:"https://res.cloudinary.com/ashishgupta/image/upload/c_scale,w_390/v1540725686/minionPic.png"},
    firstName:String,
    lastName:String,
    email:{type:String,unique:true,required:true},
    resetPasswordExpires:Date,
    reserPasswordToken:String
});
UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);
