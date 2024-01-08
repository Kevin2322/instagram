var express = require('express');
var router = express.Router();
const userModel =  require('./users');
const postModel =  require('./post');
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require('./multer');
const mongoose = require('mongoose');


passport.use(new localStrategy(userModel.authenticate()));
router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});

router.get('/feed', isLoggedIn, async function(req, res) {
  const posts = await postModel.find().populate("user");// aa line no meaning post kai id thi post thay che ae janva mate thay che and populate function na use thi post kai id thi karva ma ave che ae get karva mate thay che ex:- user table na fields
  res.render('feed', {footer: true, posts});
});

router.get('/profile',isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username : req.session.passport.user});
  res.render('profile', {footer: true, user});
});

router.get('/search',isLoggedIn, function(req, res) {
  res.render('search', {footer: true});
});

router.get('/edit',isLoggedIn,async function(req, res) {
  const user = await userModel.findOne({username : req.session.passport.user});
  res.render('edit', {footer: true, user});
});

router.get('/upload', isLoggedIn,function(req, res) {
  res.render('upload', {footer: true});
});

router.post("/register", function(req,res,next){
  const userData = new userModel({
    username : req.body.username,
    name : req.body.name,
    email : req.body.email
  });

    userModel.register(userData,req.body.password) // promise return kare aa line
    .then(function(){ //aa line ma .then thi promise ne call karay
        passport.authenticate("local")(req,res,function(){
          res.redirect("/profile");
        })

    });
      
})


router.post('/login',passport.authenticate("local", {
  successRedirect:"/profile" ,
  failureRedirect:'/login'
}) ,function(req,res){

});

router.post('/logout',function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect("/login")
}

// router.post("/update", upload.single("image"), async function(req, res) {
//   try {
//     const user = await userModel.findOneAndUpdate(
//       { user: req.session.passport?.user },
//       { username: req.body.username, name: req.body.name, bio: req.body.bio },
//       { new: true }
//     );

//     if (req.file) {
//       user.profileImage = req.file.filename;
//     }
    
//     await user.save(); // Save the changes if there's a file
//     res.redirect("/profile");
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.post("/update", upload.single("image"), async function (req, res) {
//   try {
//     const result = userModel.updateOne(
//       { user: req.session.passport?.user },
//       {
//           username: req.body.username,
//           name: req.body.name,
//           bio: req.body.bio,
//           profileImage: req.file ? req.file.filename : undefined,
//       }
//     );

//     console.log(result);

//     if (result.n === 0) {
//       return res.status(404).send("User not found");
//     }

//     res.redirect("/profile");
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.post("/upload",isLoggedIn,upload.single("image"),async function(req,res){
  const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.create({
    picture: req.file.filename,
    user: user._id,
    caption : req.body.caption
   })
   user.posts.push(post._id);
   await user.save();
   res.redirect("/feed");
})

module.exports = router;
