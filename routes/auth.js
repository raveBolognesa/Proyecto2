const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');
const ensureLoggedIn = require("../middlewares/ensureLoggedIn.js");
const isCreator = require("../middlewares/isCreator.js");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", uploadCloud.single('photo'), (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;
  const photo = req.body.photo;
  const rating = req.body.rating;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      phone,
      photo,
      rating,
      imgPath,
      imgName
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});



router.get('/auth/:id/edit', [ensureLoggedIn, isCreator],(req, res, next) => { 
  User.findOne({_id: req.params.id})
    .then(user => {
      
      res.render('auth/editProfile', user);
    })
    .catch(err => {
      res.render('./error', err)
    })
});

// editado
router.post('/auth/:id/edit', [ensureLoggedIn, isCreator], uploadCloud.single('photo'), (req, res, next) => { 
  const { username, email, password, phone, photo, rating} = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
 

      User.findOneAndUpdate({_id: req.params.id}, {username, email, password, phone, photo, rating})
        .then(celebrity => {
          res.redirect('/profile');
        })
        .catch(err => {
          res.render('./error', err)
        })
})



// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback

router.get('/facebook',
  passport.authenticate('facebook', 
  // { scope: ['https://www.googleapis.com/auth/plus.login'] }
  )
  )

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


// OAuth callback url
router.get('/slack/callback', 
  passport.authenticate('slack', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/')
  }
);

// path to start the OAuth flow
router.get('/slack', passport.authenticate('slack'), (req, res, next) => {
  next()
});

router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;
