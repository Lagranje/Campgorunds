var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var passport = require("passport");


//root route
router.get("/", function(req,res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});


//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, 
                            firstName: req.body.firstName, 
                            lastName: req.body.lastName, 
                            avatar:req.body.avatar, 
                            email:req.body.email
    });
    if(req.body.adminCode==="secretcode123"){
        newUser.isAdmin = true;
    }
    User.register( newUser, req.body.password, function(err, user){
           if(err){
          return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Wellcome To YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: ("/campgrounds"),
    failureRedirect: ("/login")
}),function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//Users profile
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong");
            return res.redirect("/campgrounds");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if (err){
                req.flash("error", "Something went wrong");
                return res.redirect("/campgrounds");
            }
            res.render("users/show", {user:foundUser, campgrounds:campgrounds});
        });
    });
});



module.exports = router;