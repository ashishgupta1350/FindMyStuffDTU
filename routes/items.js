require('dotenv').config()
var express=require("express");

var router=express.Router(),
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")
var middleware = require("../middleware/middleware.js");
var NodeGeocoder = require('node-geocoder');
var prompt = require('prompt');
var nodemailer = require('nodemailer');



// image upload code 

var cloudinary      =require('cloudinary'),
    cloudinaryStorage = require('multer-storage-cloudinary'),
    multer          =require('multer')


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
var upload = multer({ storage: storage, fileFilter: imageFilter});


cloudinary.config(
    {
        cloud_name: "ashishgupta",
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    } 
);
 
// Image upload code requirements over

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

function nodemailerCode( MAILTO, SUBJECT,MESSAGE,req,res)
{
    // console.log("step 2.1")
    //     // create reusable transporter object using the default SMTP transport
    //     var transporter = nodemailer.createTransport({
    //         service: "Gmail",
    //         auth: {
    //             user: "ashishs.gu@gmail.com",
    //             pass: 
    //         }
    //     });
    //     console.log("step 2.2")

    //     // setup email data with unicode symbols
    //     let mailOptions = {
    //         from: 'innovatedtu@gmail.com', // sender address
    //         to: 'ashishgupta1350@gmail.com, innovatedtu@gmail.com', // list of receivers
    //         subject: 'Find My Stuff DTU: Someone found your item! ✔', // Subject line
    //         text: 'A person with email xyz found your item. You can check the comments section.', // plain text body
    //         html: '<a>https://google.co.in</a>' // html body
    //     };
    //     console.log("step 2.3")
    

    //     // send mail with defined transport object
    //     transporter.sendMail(mailOptions, (error, info) => {
    //         if (error) {
    //             res.flash("error",error.message);
    //             res.redirect("/items")
    //         }
    //         console.log('Message sent: %s', info.messageId);
    //         // Preview only available when sending through an Ethereal account
    //         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //         req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
    //         res.redirect("/items");
    //         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    //         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    //     });

    // var mail = require("nodemailer").mail;
    // console.log(mail);

    // mail({
    //     from: "Fred Foo ✔ <ashishs.gu@gmail.com>", // sender address
    //     to: "ashishgupta1350@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world ✔", // plaintext body
    //     html: "<b>Hello world ✔</b>" // html body
    // });


// THIS IS WORKING ----------------------------------------------------------------------------------


    // Generate SMTP service account from ethereal.email
    // nodemailer.createTestAccount((err, account) => {
    //     if (err) {
    //         console.error('Failed to create a testing account');
    //         console.error(err);
    //         return process.exit(1);
    //     }

    //     console.log('Credentials obtained, sending message...');

    //     // NB! Store the account object values somewhere if you want
    //     // to re-use the same account for future mail deliveries

    //     // Create a SMTP transporter object
        
    //     let transporter = nodemailer.createTransport(
    //         {
    //         host: 'smtp.ethereal.email',
    //         port: 587,
    //         auth: {
    //             user: 'kd3y6sgpv6uhbjgm@ethereal.email',
    //             pass: 'wYU72NE5RsxtsKrE7K'
    //         }
    //     },
    //         {
    //             // default message fields

    //             // sender info
    //             from: 'ashishs.gu@gmail.com',
    //             headers: {
    //                 'X-Laziness-level': 1000 // just an example header, no need to use this
    //             }
    //         }
    //     );

    //     // Message object
    //     let message = {
    //         // Comma separated list of recipients
    //         to: 'ashishgupta1350@gmail.com',

    //         // Subject of the message
    //         subject: 'Nodemailer is unicode friendly ✔',

    //         // plaintext body
    //         text: 'Hello to myself!',

    //         // HTML body
    //         html:
    //             '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
    //             '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

    //         // An array of attachments
    //         attachments: [
    //             // String attachment
    //             {
    //                 filename: 'notes.txt',
    //                 content: 'Some notes about this e-mail',
    //                 contentType: 'text/plain' // optional, would be detected from the filename
    //             }

                
    //         ]
    //     };

    //     transporter.sendMail(message, (error, info) => {
    //         if (error) {
    //             console.log('Error occurred');
    //             console.log(error.message);
    //             res.redirect("/");
    //             return process.exit(1);
    //         }

    //         console.log('Message sent successfully!');
    //         console.log(nodemailer.getTestMessageUrl(info));
    //         res.redirect("/items");

    //         // only needed when using pooled connections
    //         // transporter.close();
    //     });
    // });
    
    // END OF WORKING CODE ------------------------------------------------------------------------
    
    
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: account.user, // generated ethereal user
//             pass: account.pass // generated ethereal password
//         }
//     });

//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: 'ashishs.gu@gmail.com', // sender address
//         to: 'ashishgupta1350@gmail.com, innovatedtu@gmail.com', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         req.flash("success", "email sent successfully");
//         res.redirect("/items");
//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// });

    
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ashishs.gu@gmail.com',
            pass: process.env.GMAILPW
        }
    });
    
    console.log('created');
    transporter.sendMail({
    from: 'ashishb.gu@gmail.com',
      to: MAILTO,
      subject: SUBJECT,
      text: MESSAGE
    },function(err)
    {
        if(err)
        {
            req.flash("error","Sorry, the email could not be sent!")
            res.redirect("/items");
        }
        else{
            req.flash("success", "An email has been sent to the owner!")
            res.redirect("/items");
        }
    });

}
router.post("/items/:id/sendemail",function(req,res)
{   
    // var found = FoundItem.findById(req.params.id);

    // eval(require("locus"))

    LostItem.findById(req.params.id,function(err, foundLostItem){
        if(err){
            console.log(err);
            res.redirect("/items");
        }
        else if(!foundLostItem)
        {
            // FoundItem.findById(req.params.id, function(err, foundFoundItem){
            FoundItem.findById(req.params.id,function(err, foundFoundItem){
            
                if(err || !foundFoundItem){
                    console.log(err);
                    req.flash("error","No such item exists");
                    res.redirect("/items");
                } else {
                    //render show template with that item
                    // res.render("show", {item: foundFoundItem});
                     console.log("step 1");

                    return nodemailerCode('ashishgupta1350@gmail.com','Find My Stuff DTU: You lost item might have been found!','Hey! Your lost item might have been found!',req,res);
                    // res.redirect("/");
                }
            });
        } 
        else {
            // console.log(foundLostItem);
            // res.render("show", {item: foundLostItem});
            console.log("step 2");
            return nodemailerCode('ashishgupta1350@gmail.com','Find My Stuff DTU: You lost item might have been found!','Hey! Your lost item might have been found!',req,res);
            // res.redirect("/");

        }
    });

    
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
        var imageLink=req.body.imageLink;

        location=req.body.location;
        geocoder.geocode(req.body.location, function (err, data) {

           
            if (err || !data.length) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
            
            lat = data[0].latitude;
            lng = data[0].longitude;
            location = data[0].formattedAddress;
            var itemObject={item:item,details:details,specifications:specifications, date:date ,time:time,author:author,location:location,lat:lat,lng:lng,image:imageLink};
            // cloudinary.uploader.upload(req.file.path, function(result) {
            //     // add cloudinary url for the image to the campground object under image property
            //     var image_url=result.secure_url;
            //     // add author to campground
            //     itemObject={item:item,details:details,specifications:specifications, date:date ,time:time,author:author,location:location,lat:lat,lng:lng,image:image_url};
                  
                
            //   });
            
            // eval(require("locus"));
            // eval(require("locus"));
            console.log(itemObject);
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
            res.redirect("back");
        }
        else if(!foundLostItem)
        {
            // FoundItem.findById(req.params.id, function(err, foundFoundItem){
            FoundItem.findById(req.params.id,function(err, foundFoundItem){
            
                if(err || !foundFoundItem){
                    console.log("No Such Item exists");
                    req.flash("error","No such item exists");
                    res.redirect("back");
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
                    res.redirect("back");
                }
                else{
                    
                    if(LostItem.findById(req.params.id))
                    {
                        LostItem.findByIdAndRemove(req.params.id,function(err){
                            if(err)
                            {
                                req.flash("error","Following error encountered : " + err.message);
                                res.redirect("back");
                            }
                            else{
                                req.flash("success","Success! Deleted the item!");
                                res.redirect("back");
                            }
                        });
                    }
                    else{
                        req.flash("success","Success! Deleted the item!");
                        res.redirect("back");
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