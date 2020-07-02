var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");


//NEW - Shows form to create a new comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});


//CREATE - Creates a new comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup Campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/backgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                }else{
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!")
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
    
})
//UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdateComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("Success", "Comment Deleted!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})



module.exports = router;