require('dotenv').config();
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    seedDB         = require("./seeds"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash");
  

    
//requiring routes    
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp_final");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATON
app.use(require("express-session")({
    secret: "I love writing back end",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.locals.moment = require('moment');

app.use(function(req, res, next){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
})

