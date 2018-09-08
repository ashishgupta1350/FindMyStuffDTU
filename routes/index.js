require('dotenv').config()
var express=require("express");
var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js"),
User        =require("../models/user"),
middleware      =require("../middleware/middleware.js")


router.get("/",function(req,res)
{
    res.render("landing"); // landing.ejs
});

router.get("/team",function(req,res)
{
    res.render("team"); // landing.ejs
});

// REGISTER ROUTES
router.get("/register",function(req,res)
{
    console.log(process.env);

    res.render("register");
});

router.post("/register",function(req,res)
{   

    var newUser=new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        avatar:req.body.avatar
    });
    // eval(require("locus")); // debug
    
    if(req.body.adminKey==process.env.ADMIN_SECRET_PASSWORD)
    {
        newUser.isAdmin=true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log("In items.js, unable to register user");
            console.log(err);
            res.redirect("back")
        }
        else{
            passport.authenticate("local")(req,res,function()
            {
                console.log("successfully registered user",req.user);
                res.locals.currentUser=req.user;
                res.redirect("/items");
            });
        }
    });
});
// login routes
router.get("/login",function(req,res)
{
    res.render("login");
});

router.post("/login",passport.authenticate('local',{
    successRedirect:'/items',
    failureRedirect:"/login"
}));

//signout
router.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/items");
});

// USER PROFILE
router.get("/users/:id",function(req,res)
{
    // this is going to throw an error
    User.findById(req.params.id, function(err,foundUser)
    {
        if(err)
        {
            res.redirect("/items");
        }
        else{
            LostItem.find().where("author.id").equals(foundUser._id).exec(function(err,allLostItems)
            {
                if(err){console.log("some error in finding the FoundItems");}
                else{
                    FoundItem.find().where("author.id").equals(foundUser._id).exec(function(err,allFoundItems)
                    {
                        if(err){console.log("some error in finding the FoundItems");}
                        else{
                            res.render("users/show",{user:foundUser,lostItems:allLostItems,foundItems:allFoundItems})
                        }
                    });
                    
                }
            });
        }
        
    });
});

router.get("/users/:id/edit",middleware.isLoggedIn, function(req,res)
{
    User.findById(req.params.id, function(err,foundUser)
    {
        if(err||!foundUser)
        {
            console.log("The user does not exists!");
            res.redirect("back");
        }
        else{
            res.render("users/edit",{user:foundUser});
        }
    });
      
});

router.put("/users/:id",checkUserOwnership,function(req,res)
{
    if(req.body.editedUser.adminKey==process.env.ADMIN_SECRET_PASSWORD)
    {
        req.body.editedUser.isAdmin=true;
    }
    else{
        req.body.editedUser.isAdmin=false;
    }
    console.log(req.body.editedUser)
    User.findByIdAndUpdate(req.params.id,req.body.editedUser,function(err) // some mistake
    {
        if(err)
        {
            console.log("OOPS, some error in put route of user");
            res.redirect("back");
        }
        else{
            res.redirect("/users/"+req.params.id);
        }
    });
});

// to be completed, adds a link to open up images in a seperate tab
router.get("/imageJPG",function(req,res)
{
    var found = FoundItem.findById(req.params.id);
    if(err)
    {
        res.redirect("/items");
    }
    else{
        res.render("displayImage");
    }
});

function checkUserOwnership(req,res,next)
{
    if(req.isAuthenticated()){
        User.findById(req.params.id,function(err,foundUser)
        {
            if(err)
            {
                console.log("The requested user could not be edited because: ",err);
                res.redirect("back");
            }
            else if(!foundUser)
            {
                console.log("User is not found");
                res.redirect("back");
            }
            else{
                console.log("in checkUserownership, currentUser is : ",req.user)
                if(foundUser._id.equals(req.user._id)||req.user.isAdmin)
                {
                    next();
                }
                else{
                    console.log("You are not authorized to change this user");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        console.log("You need to be logged in to change the user!");
        res.redirect("/login");
    }

}
module.exports = router;