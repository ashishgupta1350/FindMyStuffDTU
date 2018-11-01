require('dotenv').config();
var express         =require("express"),
    mongoose        =require("mongoose"),
    methodOverride  =require("method-override")
    passport        =require("passport"),
    LocalStrategy   =require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose"),
    User            =require("./models/user"),
    LostItem        =require("./models/lost.js"),
    FoundItem       =require("./models/found.js"),
    everyauth       =require("everyauth"),
    middleware      =require("./middleware/middleware.js"),
    Comment         =require("./models/comment"),
    // GoogleStrategy  =require('passport-google-oauth').OAuth2Strategy,
    findOrCreate    =require("mongoose-findorcreate"),
    moment          =require("moment"),
    bodyParser      =require("body-parser"),
    flash           =require("connect-flash"),
    cloudinary      =require('cloudinary'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    multer          =require('multer')

var app=express();


cloudinary.config(
{
    cloud_name: "ashishgupta",
    api_key: "788167666823636",
    api_secret: "EoHSoZV19vyD33DqJAFezC9rx1Y",

});

var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'testing',
    allowedFormats: ['jpg','png'],
    filename: function(req, file, cb) {
        cb(undefined, 'file');
    }
});



// google


// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


// pusher

//  single headed notifications

// notifications on phone

//  https://pusher.com/tutorials/realtime-likes-nodejs/





// add to items.js -- name should be images 
var parser = multer({ storage: storage});
app.post('/upload',parser.array('images', 1), function(req, res){
    console.log(req.files);
    res.status(201).send(req.files[0].secure_url);
})
app.use(methodOverride("_method"));
app.use(flash());

var itemsRoute=require("./routes/items"),
    indexRoute=require("./routes/index"),
    commentRoute=require("./routes/comment")

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
// mongoose.connect("mongodb://localhost/findDTU",{ useNewUrlParser: true });
 mongoose.connect("mongodb://ashish1:ashish1@ds143593.mlab.com:43593/fmsdtu",{ useNewUrlParser: true });


app.use(require("express-session")({
    secret:"Session for Find My Stuff DTU",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
    // req.locals.currentUser=req.user;
    res.locals.currentUser=req.user;
    res.locals.ADMIN_SECRET_KEY=process.env.ADMIN_SECRET_KEY;
    res.locals.success= req.flash("success");
    res.locals.error  =req.flash("error");
    res.locals.info   =req.flash("info");
    next(); // this turns on the middle ware
});

// IMPORTANT NOTE -- DO NOT DELETE

// USE THE CURRENT USER ROUTE AFTER APP.USE (PASSPORT) AND BEFOOOOOORE APP.USE (ITEMS ROUTE)
// REFER https://www.udemy.com/the-web-developer-bootcamp/learn/v4/t/lecture/3861700?start=0

app.use(itemsRoute);
app.use(indexRoute);
app.use(commentRoute);
app.get("*",function(req,res)
{
    res.render("notfound/show.ejs")
});

// <<<<<<< HEAD
app.listen(process.env.PORT,process.env.IP)
{
    console.log("The FindMyStuff server has started!");
}
// =======

// app.listen(3000,function()
// >>>>>>> 2a8f800ce2b69be526cb4532529b1fc21e7fe165
// {
//     // killall -9 node    Use this in Terminal if the port 3000 is 
//     //                    occupied


//     console.log("The FindMyStuff server has started!");
// };




