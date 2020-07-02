var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    passport   = require("passport"),
    middleware = require("../middleware"),
    User       = require("../models/user");




router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
    res.render("register");
});

//handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect('/register')
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp  " +  user.username);
            res.redirect("/campgrounds");
        })
    })
})

router.get("/login", function(req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", 
    {successRedirect: "/campgrounds",
     failureRedirect: "/login"}), 
     function(req, res) {
})

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!!")
    res.redirect("/campgrounds");
});

module.exports = router;