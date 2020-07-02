var express          = require("express"),
    app              = express(),
    bodyparser       = require("body-parser"),
    mongoose         = require("mongoose"),
    Campground       = require("./models/campground"),
    seedDB           = require("./seeds"),
    Comment          = require("./models/comment"),
    passport         = require("passport"),
    User             = require("./models/user"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    flash            = require("connect-flash"),
    indexRoutes      = require("./routes/index");
    

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://test:test12@ds217310.mlab.com:17310/ramziyelpcamp");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "Chelsea FC is the best team ever!!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})


app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELP CAMP HAS STARTED");
});

