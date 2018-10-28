require('dotenv').config()
var express=require("express");

var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")
var middleware = require("../middleware/middleware.js");
var NodeGeocoder = require('node-geocoder');
var prompt = require('prompt');

// Image upload part of code
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'ashishgupta', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey:process.env.GEOCODER_API_KEY_MAIN, // to update to env variables
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/items",function(req,res)
{
    var noMatch = null;
    // eval(require("locus"));
    if(req.query.search)
    {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        LostItem.find({item:regex},function(err,allLostItems){
            if(err)
            {
                // console.log(err);
                req.flash("error","Following error encountered : " + err.message);
                res.redirect("back");
                // res.send("some error");
            }
            else{ 
                FoundItem.find({item:regex},function(err,allFoundItems){
                    if(err)
                    {
                        console.log("Some error while finding the items in items.js")
                        req.flash("error","Following error encountered : " + err.message);
                        res.redirect("back");
                    }
                    else{
                        
                        if(allFoundItems.length<1 || allLostItems.length<1){
                            res.render("items",{lostItems:allLostItems,foundItems:allFoundItems,noMatch:noMatch});
                        } 
                    }
                
                });
            }
        });
    }
    else{   
        LostItem.find({},function(err,allLostItems){
            if(err)
            {
                // console.log(err);
                req.flash("error","Following error encountered : " + err.message);
                res.redirect("back");
                // res.send("some error");
            }
            else{ 
                FoundItem.find({},function(err,allFoundItems){
                    if(err)
                    {
                        console.log("Some error while finding the items in items.js")
                        req.flash("error","Following error encountered : " + err.message);
                        res.redirect("back");
                    }
                    else{
                        res.render("items",{lostItems:allLostItems,foundItems:allFoundItems,noMatch:noMatch}); 
                    }
                
                });
            }
        });
    }
    
});
router.post("/items",middleware.isLoggedIn,upload.single('image'),function(req,res)
{
    // console.log(req.body);
    // console.log(req.body.isLost);

    var item=req.body.item;
        var details=req.body.details;
        var specifications=req.body.specifications;
        var date=req.body.date;
        var time=req.body.time;
        var author={
            id:req.user._id,
            username:req.user.username
        };
        var lat;
        var lng;
        var location;

        location=req.body.location;
        geocoder.geocode(req.body.location, function (err, data) {

           
            if (err || !data.length) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
            
            lat = data[0].latitude;
            lng = data[0].longitude;
            location = data[0].formattedAddress;
            var itemObject={item:item,details:details,specifications:specifications, date:date ,time:time,author:author,location:location,lat:lat,lng:lng};
            // cloudinary.uploader.upload(req.file.path, function(result) {
            //     var itemObject_cloudinary={item:item,details:details,specifications:specifications, date:date ,time:time,author:author,location:location,lat:lat,lng:lng};
            //     itemObject=itemObject_cloudinary;
            // });
        // eval(require("locus"));

        if(req.body.isLost=="lost"){
        
            LostItem.create(itemObject,function(err,newlyCreated)
            {
                if(err)
                {
                    console.log(err);
                    req.flash("error","Following error encountered : " + err.message);
                    res.redirect("back");
                }
                else{
                    req.flash("success","Success! Added your lost item!");
                    
                    return res.redirect("/items");
                }
            });
        }
        else{
            FoundItem.create(itemObject,function(err,newlyCreated)
            {
                if(err)
                {
                    req.flash("error","Following error encountered : " + err.message);

                    console.log(err);
                }
                else{
                    req.flash("success","Success! Added item found by you!");
                    return res.redirect("/items");
                }
            });
        }
    });
        
});


router.get("/items/new", middleware.isLoggedIn,function(req,res)
{
    res.render("new2");
});

router.get("/items/:id",function(req,res)
{
        // ObjectId.fromString( req.params.id ); This needs to be done to remove that casting error

    // LostItem.findById(req.params.id, function(err, foundLostItem){
    // console.log(req.params.id)
    
    LostItem.findById(req.params.id).populate("comments").exec(function(err, foundLostItem){
        if(err){
            console.log(err);
            res.redirect("/items");
        }
        else if(!foundLostItem)
        {
            // FoundItem.findById(req.params.id, function(err, foundFoundItem){
            FoundItem.findById(req.params.id).populate("comments").exec(function(err, foundFoundItem){
            
                if(err || !foundFoundItem){
                    // console.log("No Such Item exists");
                    console.log(err);
                    req.flash("error","No such item exists");
                    res.redirect("/items");
                } else {
                    //render show template with that item
                    res.render("show", {item: foundFoundItem});
                }
            });
        } 
        else {
            // console.log(foundLostItem);
            res.render("show", {item: foundLostItem});
        }
    });
});

router.get("/items/:id/edit",function(req,res)
{
    // console.log(req.params);
    LostItem.findById(req.params.id,function(err, foundLostItem){
        if(err){
            console.log(err);
            req.flash("error","Following error encountered : " + err.message);
            res.redirect("/items");
        }
        else if(!foundLostItem)
        {
            // FoundItem.findById(req.params.id, function(err, foundFoundItem){
            FoundItem.findById(req.params.id,function(err, foundFoundItem){
            
                if(err || !foundFoundItem){
                    console.log("No Such Item exists");
                    req.flash("error","No such item exists");
                    res.redirect("/items");
                } else {
                    //render show template with that item
                    res.render("edit", {item: foundFoundItem});
                }
            });
        } 
        else {
            // console.log(foundLostItem);
            res.render("edit", {item: foundLostItem});
        }
    });
});

router.put("/items/:id",middleware.isLoggedIn,function(req,res)
{
    
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address, Please retype again or use maps!');
          return res.redirect('back');
        }
        req.body.item.lat = data[0].latitude;
        req.body.item.lng = data[0].longitude;
        req.body.location = data[0].formattedAddress;
        
        if(req.body.item.isLost=="lost")
        {
            LostItem.findByIdAndUpdate(req.params.id, req.body.item, function(err, item){
                if(err||!item){
                    req.flash("error","Following error encountered : " + err.message);
                    console.log(err);
                    res.redirect("back");
                } else {
                    req.flash("success","Successfully Updated!");
                    res.redirect("/items/" + item._id);
                }
            });
        } else {
            FoundItem.findByIdAndUpdate(req.params.id, req.body.item, function(err, item){
                if(err||!item){
                    req.flash("error","Following error encountered : " + err.message);  
                    res.redirect("back");
                } else {
                    req.flash("success","Successfully Updated!");
                    res.redirect("/items/" + item._id);
                }
            });
        }
      });
});

router.delete("/items/:id",middleware.checkItemOwnership,function(req,res)
{
   var found = FoundItem.findById(req.params.id);
   if(found){
            
    

            FoundItem.findByIdAndRemove(req.params.id,function(err){
                if(err)
                {
                    req.flash("error","Following error encountered : " + err.message);
                    res.redirect("/items");
                }
                else{
                    
                    if(LostItem.findById(req.params.id))
                    {
                        LostItem.findByIdAndRemove(req.params.id,function(err){
                            if(err)
                            {
                                req.flash("error","Following error encountered : " + err.message);
                                res.redirect("/items");
                            }
                            else{
                                req.flash("success","Success! Deleted the item and sent your mail to the owner!");
                                res.redirect("/items");
                            }
                        });
                    }
                    else{
                        req.flash("success","Success! Deleted the item and sent your mail to the owner!");
                        res.redirect("/items");
                    }
                    // res.redirect("/items");
                    
                }
            });
    }
    
});
// regular expression to do fuzzy search

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;