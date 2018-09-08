var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var pasportLocal=require("passport-local");

var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{type:Boolean,default:false},
    avatar:{type:String,default:"https://i.pinimg.com/236x/a7/e8/fb/a7e8fbe6ccae9e568d6324f3323ee840--minions--minions-despicable-me.jpg"},
    firstName:String,
    lastName:String,
    email:String
    


});
UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);
