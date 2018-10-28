require('dotenv').config()
var express=require("express");
var router=express.Router(),
    LostItem        =require("../models/lost.js"),
    FoundItem       =require("../models/found.js"),
    User            =require("../models/user"),
    middleware      =require("../middleware/middleware.js"),
    async           =require("async"),
    nodemailer      =require("nodemailer"),
    crypto          =require("crypto")

router.get("/",function(req,res)
{
    res.render("landing",{GEOCODER_API_KEY_MAIN:process.env.GEOCODER_API__MAIN}); // landing.ejs
});

router.get("/team",function(req,res)
{
    res.render("team"); // landing.ejs
});

// REGISTER ROUTES
router.get("/register",function(req,res)
{

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
            req.flash("error","Following error encountered : " + err.message);  
            res.redirect("back")
        }
        else{
            passport.authenticate("local")(req,res,function()
            {
                console.log("successfully registered user",req.user);
                req.flash("success","Registered! Welcome to FindMyStuffDTU " + user.username);
                // res.locals.currentUser=req.user;
                res.redirect("/items");
            });
        }
    });

});

// About page routes
router.get("/about",function(req,res)
{
    res.render("users/about");
});

// DTU security page routes
router.get("/dtusecurity",function(req,res)
{
    res.send("Work under progress. Want to contribute? Send a request @ ashishgupta1350@gmail.com")
});

// login routes
router.get("/login",function(req,res)
{
    res.render("login");
});

router.post("/login",passport.authenticate('local',{
    successRedirect:'/items',
    failureRedirect: "/login",
    failureFlash: true,
    failureFlash: "No such account exists!",
    successFlash: 'Welcome to FindMyStuffDTU!',
    failureRedirect:"/login"
}));

//signout
router.get("/logout",function(req,res)
{
    req.logout();
    req.flash("success","You are logged out!");
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
                if(err){
                    console.log("some error in finding the FoundItems");
                    req.flash("error","Following error encountered : " + err.message);  
                    res.redirect("back");
                }
                else{
                    FoundItem.find().where("author.id").equals(foundUser._id).exec(function(err,allFoundItems)
                    {
                        if(err){
                            console.log("some error in finding the FoundItems");
                            req.flash("error","Following error encountered : " + err.message);  
                            res.redirect("back");
                        }
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
            req.flash("error","The user does not exists");              
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
    // console.log(req.body.editedUser)
    User.findByIdAndUpdate(req.params.id,req.body.editedUser,function(err) // some mistake
    {
        if(err)
        {
            console.log("OOPS, some error in put route of user");
            req.flash("error","Following error encountered : " + err.message);  
            res.redirect("back");
        }
        else{
            User.findById(req.params.id, function(err, user) {
            user.setPassword(req.body.editedUser.password, function(err) {
                user.save(function(err) {
                    req.logIn(user, function(err) {
                    // done(err, user);
                    req.flash("success","User and Password Updated!");                      
                    res.redirect("/users/"+req.params.id);

                  });
                });
              });
            });
        }
    });
});


// Forgot password route
router.get("/forgot",function(req,res)
{
    res.render("forgot");
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            console.log("error, The email doesnot exists");
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'innovatedtu@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'innovatedtu@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
            'Regards, Ashish\n @Creator\n FindMyStuffDTU'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
             done(err, 'done');
        });
      }
    ], function(err) {
      if (err) {console.log("error in router post : ",err); return next(err);}
      res.redirect('back');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        console.log('error', 'Password reset token is invalid or has expired.');
        console.log("Not found User in get route for /reset/token")
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            console.log("error","Password reset token is invalid or has expired");
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'innovatedtu@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'innovatedtu@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' +
            '\nRegards,\nAshish\n@Creator\nFindMyStuffDTU'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success!s Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/items');
    });
  });

function checkUserOwnership(req,res,next)
{
    if(req.isAuthenticated()){
        User.findById(req.params.id,function(err,foundUser)
        {
            if(err)
            {
                console.log("The requested user could not be edited because: ",err);
                req.flash("error","Following error encountered : " + err.message);  
                res.redirect("back");
            }
            else if(!foundUser)
            {
                console.log("User is not found");
                req.flash("error","User not found");  
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
                    req.flash("error","You are not authorized to change this user");  
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You are not authorized and logged in to change this user");          
        res.redirect("/login");
    }

}
module.exports = router;